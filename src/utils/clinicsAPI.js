import axios from 'axios';
import { API_CONFIG, validateApiConfig } from '../config/apiKeys';
import realClinicsData from './realClinicsData.json';

/**
 * Busca clínicas próximas usando dados reais do OpenStreetMap
 * @param {number} latitude - Latitude da localização
 * @param {number} longitude - Longitude da localização
 * @param {number} radius - Raio de busca em metros (padrão: 5000)
 * @returns {Promise<Array>} Lista de clínicas encontradas
 */
export const searchNearbyClinics = async (latitude, longitude, radius = API_CONFIG.DEFAULT_SEARCH_RADIUS) => {
  try {
    // Verifica se a configuração está correta
    const apiValidation = validateApiConfig();
    if (!apiValidation.isValid) {
      throw new Error('Configuração da API inválida');
    }

    // Converte raio de metros para graus (aproximadamente)
    const radiusInDegrees = radius / 111000; // 1 grau ≈ 111km

    // Query Overpass para buscar clínicas e postos de saúde
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["healthcare"="clinic"](around:${radius},${latitude},${longitude});
        node["healthcare"="hospital"](around:${radius},${latitude},${longitude});
        node["healthcare"="doctor"](around:${radius},${latitude},${longitude});
        way["amenity"="clinic"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["healthcare"="clinic"](around:${radius},${latitude},${longitude});
        way["healthcare"="hospital"](around:${radius},${latitude},${longitude});
        way["healthcare"="doctor"](around:${radius},${latitude},${longitude});
        relation["amenity"="clinic"](around:${radius},${latitude},${longitude});
        relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
        relation["healthcare"="clinic"](around:${radius},${latitude},${longitude});
        relation["healthcare"="hospital"](around:${radius},${latitude},${longitude});
        relation["healthcare"="doctor"](around:${radius},${latitude},${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    // Busca dados do OpenStreetMap
    const osmResponse = await axios.get('https://overpass-api.de/api/interpreter', {
      params: { data: overpassQuery },
      timeout: API_CONFIG.REQUEST_TIMEOUT
    });

    // Processa os resultados do OpenStreetMap
    const osmClinics = processOSMData(osmResponse.data, latitude, longitude);

    // Se não encontrou dados suficientes, busca dados do SUS
    if (osmClinics.length < 3) {
      const susClinics = await searchSUSClinics(latitude, longitude, radius);
      osmClinics.push(...susClinics);
    }

    // Remove duplicatas e ordena por distância
    const uniqueClinics = removeDuplicates(osmClinics);
    const sortedClinics = uniqueClinics
      .sort((a, b) => a.distance - b.distance)
      .slice(0, API_CONFIG.MAX_CLINICS_RESULTS);

    // Se ainda não tem dados suficientes, adiciona dados de fallback
    if (sortedClinics.length < 3) {
      const fallbackData = getFallbackClinics();
      const fallbackWithDistance = fallbackData.map(clinic => ({
        ...clinic,
        distance: calculateDistance(latitude, longitude, clinic.coordinate.latitude, clinic.coordinate.longitude)
      }));
      
      // Combina dados reais com fallback
      const combinedClinics = [...sortedClinics, ...fallbackWithDistance];
      return removeDuplicates(combinedClinics)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, API_CONFIG.MAX_CLINICS_RESULTS);
    }

    return sortedClinics;

  } catch (error) {
    console.error('Erro ao buscar clínicas reais:', error);
    
    // Em caso de erro, usa dados de fallback
    const fallbackData = getFallbackClinics();
    const fallbackWithDistance = fallbackData.map(clinic => ({
      ...clinic,
      distance: calculateDistance(latitude, longitude, clinic.coordinate.latitude, clinic.coordinate.longitude)
    }));
    
    return fallbackWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, API_CONFIG.MAX_CLINICS_RESULTS);
  }
};

/**
 * Processa dados do OpenStreetMap
 * @param {Object} osmData - Dados da API Overpass
 * @param {number} userLat - Latitude do usuário
 * @param {number} userLng - Longitude do usuário
 * @returns {Array} Lista de clínicas processadas
 */
const processOSMData = (osmData, userLat, userLng) => {
  const clinics = [];
  
  if (!osmData.elements) return clinics;

  osmData.elements.forEach(element => {
    if (element.type === 'node' && element.tags) {
      const clinic = processOSMElement(element, userLat, userLng);
      if (clinic) {
        clinics.push(clinic);
      }
    }
  });

  return clinics;
};

/**
 * Processa um elemento do OpenStreetMap
 * @param {Object} element - Elemento OSM
 * @param {number} userLat - Latitude do usuário
 * @param {number} userLng - Longitude do usuário
 * @returns {Object|null} Clínica processada ou null
 */
const processOSMElement = (element, userLat, userLng) => {
  const tags = element.tags;
  
  // Determina o tipo da clínica
  const type = determineClinicType(tags);
  if (!type) return null;

  // Calcula distância
  const distance = calculateDistance(userLat, userLng, element.lat, element.lon);

  // Gera endereço
  const address = generateAddress(tags, element.lat, element.lon);

  return {
    id: `osm_${element.id}`,
    name: tags.name || tags['name:pt'] || 'Clínica',
    type: type,
    address: address,
    phone: tags.phone || tags.contact_phone || '',
    website: tags.website || tags.contact_website || '',
    rating: 0, // OpenStreetMap não tem ratings
    totalRatings: 0,
    coordinate: {
      latitude: element.lat,
      longitude: element.lon,
    },
    distance: distance,
    description: generateDescriptionFromTags(tags, type),
    openingHours: tags.opening_hours || 'Horário não informado',
    photos: [],
    isRealData: true
  };
};

/**
 * Determina o tipo da clínica baseado nas tags OSM
 * @param {Object} tags - Tags do elemento OSM
 * @returns {string|null} Tipo da clínica ou null
 */
const determineClinicType = (tags) => {
  const name = (tags.name || '').toLowerCase();
  const healthcare = tags.healthcare || '';
  const amenity = tags.amenity || '';

  // Palavras-chave para nutricionistas
  const nutritionistKeywords = [
    'nutricionista', 'nutrição', 'nutri', 'dieta', 'alimentação',
    'nutrição clínica', 'nutrição esportiva', 'nutrição funcional'
  ];

  // Verifica se é nutricionista
  if (nutritionistKeywords.some(keyword => name.includes(keyword))) {
    return 'Nutricionista';
  }

  // Verifica por tags de saúde
  if (healthcare === 'clinic' || healthcare === 'doctor') {
    return 'Clínica Médica';
  }

  if (healthcare === 'hospital') {
    return 'Posto de Saúde';
  }

  if (amenity === 'clinic') {
    return 'Clínica Médica';
  }

  if (amenity === 'hospital') {
    return 'Posto de Saúde';
  }

  // Se tem tag de saúde mas não identificou tipo específico
  if (healthcare || amenity === 'clinic' || amenity === 'hospital') {
    return 'Clínica Médica';
  }

  return null;
};

/**
 * Gera endereço a partir das tags OSM
 * @param {Object} tags - Tags do elemento OSM
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Endereço formatado
 */
const generateAddress = (tags, lat, lon) => {
  const parts = [];
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:state']) parts.push(tags['addr:state']);
  
  if (parts.length > 0) {
    return parts.join(', ');
  }
  
  // Se não tem endereço detalhado, retorna coordenadas aproximadas
  return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
};

/**
 * Gera descrição baseada nas tags OSM
 * @param {Object} tags - Tags do elemento OSM
 * @param {string} type - Tipo da clínica
 * @returns {string} Descrição gerada
 */
const generateDescriptionFromTags = (tags, type) => {
  const descriptions = {
    'Nutricionista': 'Especializada em nutrição e alimentação saudável',
    'Posto de Saúde': 'Unidade de saúde com atendimento básico',
    'Clínica Médica': 'Clínica médica com diversos especialistas'
  };

  return descriptions[type] || 'Estabelecimento de saúde';
};

/**
 * Busca clínicas do SUS (dados públicos)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} radius - Raio em metros
 * @returns {Promise<Array>} Lista de clínicas do SUS
 */
const searchSUSClinics = async (latitude, longitude, radius) => {
  try {
    // API pública do SUS (exemplo - pode variar)
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', {
      timeout: API_CONFIG.REQUEST_TIMEOUT
    });

    // Por enquanto, retorna array vazio
    // Em uma implementação completa, processaria os dados do SUS
    return [];

  } catch (error) {
    console.warn('Erro ao buscar dados do SUS:', error);
    return [];
  }
};

/**
 * Remove clínicas duplicadas baseado na proximidade
 * @param {Array} clinics - Lista de clínicas
 * @returns {Array} Lista sem duplicatas
 */
const removeDuplicates = (clinics) => {
  const unique = [];
  const seen = new Set();

  clinics.forEach(clinic => {
    const key = `${clinic.coordinate.latitude.toFixed(4)}_${clinic.coordinate.longitude.toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(clinic);
    }
  });

  return unique;
};

/**
 * Busca clínicas por endereço
 * @param {string} address - Endereço para busca
 * @returns {Promise<Array>} Lista de clínicas encontradas
 */
export const searchClinicsByAddress = async (address) => {
  try {
    // Usa Nominatim (geocoding do OpenStreetMap) para converter endereço em coordenadas
    const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'br'
      },
      timeout: API_CONFIG.REQUEST_TIMEOUT
    });

    if (geocodeResponse.data.length > 0) {
      const location = geocodeResponse.data[0];
      return await searchNearbyClinics(parseFloat(location.lat), parseFloat(location.lon));
    }

    // Se não encontrou, retorna dados de fallback
    return getFallbackClinics();

  } catch (error) {
    console.error('Erro ao buscar clínicas por endereço:', error);
    return getFallbackClinics();
  }
};

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em metros
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Gera descrição para a clínica
 * @param {Object} clinic - Dados da clínica
 * @param {string} type - Tipo da clínica
 * @returns {string} Descrição gerada
 */
const generateDescription = (clinic, type) => {
  const descriptions = {
    'Nutricionista': [
      'Especializada em nutrição clínica e esportiva',
      'Atendimento personalizado para dietas e reeducação alimentar',
      'Consultoria nutricional para diferentes objetivos',
      'Avaliação nutricional completa e planos alimentares'
    ],
    'Posto de Saúde': [
      'Unidade básica de saúde com atendimento geral',
      'Serviços de saúde pública e preventiva',
      'Atendimento médico básico e vacinação',
      'Acompanhamento de saúde da família'
    ],
    'Clínica Médica': [
      'Clínica médica com diversos especialistas',
      'Atendimento médico geral e especializado',
      'Exames e consultas médicas',
      'Serviços de saúde integrados'
    ]
  };

  const typeDescriptions = descriptions[type] || descriptions['Clínica Médica'];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

/**
 * Retorna dados de fallback de clínicas
 * @returns {Array} Lista de clínicas de exemplo
 */
export const getFallbackClinics = () => {
  // Usa dados reais do arquivo JSON
  return realClinicsData.clinics.map(clinic => ({
    ...clinic,
    photos: [], // Adiciona array de fotos vazio
    distance: 0 // Será calculado dinamicamente
  }));
}; 