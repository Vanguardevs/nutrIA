import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  Linking,
  RefreshControl,
  TextInput
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { searchNearbyClinics, searchClinicsByAddress, getFallbackClinics } from '../../../utils/clinicsAPI';
import realClinicsData from '../../../utils/realClinicsData.json';
import nutricionistasData from '../../../utils/nutricionistas_sao_paulo.json';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(false);
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchInAll, setSearchInAll] = useState(false);
  const [allClinics, setAllClinics] = useState([]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(2);

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2';
  const textColor = colorScheme === 'dark' ? '#F2F2F2' : '#1C1C1E';

  // Tipos de estabelecimento disponíveis (deve ser declarado antes de qualquer uso)
  const types = [
    { key: 'clinica', label: 'Clínicas Próximas' },
    { key: 'hospital', label: 'Hospitais Próximos' },
    { key: 'nutricionista', label: 'Nutricionistas Próximos' },
  ];
  const selectedType = types[selectedTypeIndex] ? types[selectedTypeIndex].key : types[0].key;

  // Função para garantir que um valor seja uma string válida
  const ensureString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Função para garantir que um valor seja um número válido
  const ensureNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    return Number(value);
  };

  // Função para validar se as coordenadas são válidas
  const validateCoordinates = (coordinate) => {
    if (!coordinate || typeof coordinate !== 'object') return false;
    
    const lat = parseFloat(coordinate.latitude);
    const lng = parseFloat(coordinate.longitude);
    
    // Verifica se são números válidos
    if (isNaN(lat) || isNaN(lng)) return false;
    
    // Verifica se estão dentro dos limites válidos (mais permissivo)
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    
    // Aceita coordenadas zeradas (0,0) - alguns estabelecimentos podem ter isso
    // if (lat === 0 && lng === 0) return false;
    
    // Para o Brasil, verifica se estão dentro de limites aproximados (mais permissivo)
    // Brasil: Latitude: -33.7 a 5.3, Longitude: -73.9 a -34.8
    if (lat < -40 || lat > 10 || lng < -80 || lng > -20) {
      console.warn(`Coordenadas suspeitas: ${lat}, ${lng}`);
      return false;
    }
    
    return true;
  };

  // Função para calcular distância entre dois pontos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Retorna em metros
  };

  // Função para buscar coordenadas pelo endereço usando Nominatim
  const fetchCoordinatesFromAddress = async (address) => {
    try {
      console.log('[Geocode] Buscando coordenadas para endereço:', address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        console.log('[Geocode] Resultado:', data[0].display_name, 'Lat:', data[0].lat, 'Lon:', data[0].lon);
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      console.warn('[Geocode] Nenhum resultado encontrado para:', address);
      return null;
    } catch (error) {
      console.warn('Erro ao buscar coordenadas pelo endereço:', error);
      return null;
    }
  };

  // Função melhorada para sanitizar dados das clínicas (agora assíncrona)
  const sanitizeClinicsData = async (clinics, userLocation = null) => {
    return Promise.all(clinics.map(async clinic => {
      let coord = clinic.coordinate;
      if (!validateCoordinates(coord) && clinic.address) {
        // Tenta buscar coordenadas pelo endereço
        const fetchedCoord = await fetchCoordinatesFromAddress(clinic.address);
        if (fetchedCoord && validateCoordinates(fetchedCoord)) {
          coord = fetchedCoord;
        } else {
          console.warn(`Não foi possível geocodificar: ${clinic.name}`);
          return null;
        }
      }
      const sanitized = {
        ...clinic,
        id: ensureString(clinic.id),
        name: ensureString(clinic.name) || 'Clínica',
        type: ensureString(clinic.type) || 'Estabelecimento de saúde',
        address: ensureString(clinic.address) || 'Endereço não informado',
        description: ensureString(clinic.description) || 'Descrição não disponível',
        openingHours: ensureString(clinic.openingHours) || 'Horário não informado',
        phone: ensureString(clinic.phone),
        website: ensureString(clinic.website),
        rating: ensureNumber(clinic.rating),
        totalRatings: ensureNumber(clinic.totalRatings),
        coordinate: {
          latitude: parseFloat(coord.latitude),
          longitude: parseFloat(coord.longitude),
        }
      };
      // Calcula distância se a localização do usuário estiver disponível
      if (userLocation) {
        sanitized.distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          sanitized.coordinate.latitude,
          sanitized.coordinate.longitude
        );
      }
      return sanitized;
    }))
    .then(results => results.filter(clinic => clinic !== null)
      .sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      })
    );
  };

  // Função para buscar clínicas usando a API real
  const fetchClinics = async (userLocation) => {
    try {
      setApiError(false);
      console.log('Buscando clínicas próximas...');
      const clinicsData = await searchNearbyClinics(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        5000 // 5km de raio
      );
      console.log('Clínicas encontradas:', clinicsData.length);
      console.log('Primeira clínica:', clinicsData[0]);
      // Usa a função melhorada de sanitização (agora assíncrona)
      const sanitizedClinics = await sanitizeClinicsData(clinicsData, userLocation);
      console.log('Clínicas sanitizadas:', sanitizedClinics.length);
      console.log('Primeira clínica sanitizada:', sanitizedClinics[0]);
      setClinics(sanitizedClinics);
      console.log(`${sanitizedClinics.length} clínicas válidas carregadas`);
    } catch (error) {
      console.error('Erro ao buscar clínicas da API:', error);
      setApiError(true);
      console.log('Usando dados de fallback...');
      const fallbackData = await getFallbackClinics();
      console.log('Dados de fallback carregados:', fallbackData.length);
      console.log('Primeira clínica de fallback:', fallbackData[0]);
      const sanitizedFallback = await sanitizeClinicsData(fallbackData, userLocation);
      console.log('Fallback sanitizado:', sanitizedFallback.length);
      console.log('Primeira clínica de fallback sanitizada:', sanitizedFallback[0]);
      setClinics(sanitizedFallback);
      Alert.alert(
        'Aviso',
        'Não foi possível carregar clínicas reais. Mostrando dados de exemplo.',
        [{ text: 'OK' }]
      );
    }
  };

  // Função para atualizar clínicas (pull-to-refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchClinics(location);
    }
    setRefreshing(false);
  };

  // Função para obter estabelecimentos conforme o tipo selecionado
  const getEstablishmentsByType = (type) => {
    if (type === 'nutricionista') {
      return nutricionistasData.filter(clinic => validateCoordinates(clinic.coordinate || { latitude: clinic.NU_LATITUDE, longitude: clinic.NU_LONGITUDE }))
        .map((item, idx) => ({
          id: item.CO_CNES || `nutri_${idx}`,
          name: item.NO_FANTASIA || item.NO_RAZAO_SOCIAL || 'Nutricionista',
          type: 'Nutricionista',
          address: `${item.NO_LOGRADOURO || ''}, ${item.NU_ENDERECO || ''} - ${item.NO_BAIRRO || ''}, São Paulo - SP, ${item.CO_CEP || ''}`.replace(/\s+/g, ' ').trim(),
          phone: item.NU_TELEFONE || '',
          website: '',
          rating: 0,
          totalRatings: 0,
          coordinate: {
            latitude: parseFloat(item.NU_LATITUDE),
            longitude: parseFloat(item.NU_LONGITUDE),
          },
          description: '',
          openingHours: item.DS_TURNO_ATENDIMENTO || '',
          isRealData: false,
        }));
    } else {
      // Clínicas e hospitais do realClinicsData.json
      return (realClinicsData.clinics || []).filter(clinic => {
        if (!validateCoordinates(clinic.coordinate)) return false;
        const name = ensureString(clinic.name).toLowerCase();
        const desc = ensureString(clinic.description).toLowerCase();
        const typeField = ensureString(clinic.type).toLowerCase();
        if (type === 'hospital') {
          // Hospital se nome ou descrição contém 'hospital'
          return name.includes('hospital') || desc.includes('hospital');
        }
        if (type === 'clinica') {
          // Clínica se NÃO for hospital nem posto
          const isHospital = name.includes('hospital') || desc.includes('hospital');
          const isPosto = typeField.includes('posto');
          return !isHospital && (typeField.includes('clínica') || typeField.includes('clinica')) && !isPosto;
        }
        return false;
      });
    }
  };

  // Função para obter estabelecimentos próximos do usuário
  const getNearbyEstablishments = (establishments, userLocation, maxDistanceMeters = 15000) => {
    if (!userLocation) return [];
    return establishments
      .map(est => {
        const lat = est.coordinate ? est.coordinate.latitude : (est.NU_LATITUDE ? parseFloat(est.NU_LATITUDE) : null);
        const lng = est.coordinate ? est.coordinate.longitude : (est.NU_LONGITUDE ? parseFloat(est.NU_LONGITUDE) : null);
        if (lat === null || lng === null) return null;
        const distance = calculateDistance(userLocation.coords.latitude, userLocation.coords.longitude, lat, lng);
        return { ...est, distance };
      })
      .filter(est => est && est.distance <= maxDistanceMeters)
      .sort((a, b) => a.distance - b.distance);
  };

  // Carregar e filtrar dados apenas quando a tela de mapas estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setLoading(true);
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            if (isActive) {
              setErrorMsg('Permissão para acessar localização foi negada');
              setLoading(false);
            }
            return;
          }
          let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          if (isActive) {
            setLocation(currentLocation);
            const allData = getEstablishmentsByType(selectedType);
            const nearby = getNearbyEstablishments(allData, currentLocation);
            setClinics(nearby);
          }
        } catch (error) {
          if (isActive) {
            setErrorMsg('Erro ao obter localização');
            setClinics([]);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      })();
      return () => { isActive = false; };
    }, [selectedType])
  );

  const handleMarkerPress = (clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCallClinic = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Informação', 'Telefone não disponível para esta clínica.');
    }
  };

  const handleNavigateToClinic = (clinic) => {
    const { latitude, longitude } = clinic.coordinate;
    // Usa OpenStreetMap para navegação (gratuito)
    const url = `https://www.openstreetmap.org/directions?from=&to=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const getMarkerIcon = (type) => {
    if (selectedType === 'nutricionista') return 'restaurant';
    if (selectedType === 'hospital') return 'medkit';
    return 'medical';
  };

  const getMarkerColor = (type) => {
    if (selectedType === 'nutricionista') return '#2E8331';
    if (selectedType === 'hospital') return '#007AFF';
    return '#007AFF';
  };

  const formatDistance = (distance) => {
    const cleanDistance = ensureNumber(distance);
    if (cleanDistance === 0) {
      return 'Distância não disponível';
    }
    if (cleanDistance < 1000) {
      return `${Math.round(cleanDistance)}m`;
    } else {
      return `${(cleanDistance / 1000).toFixed(1)}km`;
    }
  };

  // Adicione verificação de região válida no MapView
  const getValidRegion = (location, clinics) => {
    if (!location) {
      // Região padrão para São Paulo
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    let minLat = location.coords.latitude;
    let maxLat = location.coords.latitude;
    let minLng = location.coords.longitude;
    let maxLng = location.coords.longitude;

    // Inclui todas as clínicas válidas no cálculo da região
    clinics.forEach(clinic => {
      if (validateCoordinates(clinic.coordinate)) {
        minLat = Math.min(minLat, clinic.coordinate.latitude);
        maxLat = Math.max(maxLat, clinic.coordinate.latitude);
        minLng = Math.min(minLng, clinic.coordinate.longitude);
        maxLng = Math.max(maxLng, clinic.coordinate.longitude);
      }
    });

    const latDelta = Math.max((maxLat - minLat) * 1.5, 0.01);
    const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.01);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  // Componente de marcador personalizado com validação
  const ValidatedMarker = ({ clinic, onPress }) => {
    if (!validateCoordinates(clinic.coordinate)) {
      return null; // Não renderiza marcadores com coordenadas inválidas
    }

    return (
      <Marker
        coordinate={clinic.coordinate}
        title={clinic.name}
        description={`${clinic.type} - ${formatDistance(clinic.distance)}`}
        onPress={() => onPress(clinic)}
      >
        <View style={[styles.customMarker, { backgroundColor: getMarkerColor(clinic.type) }]}>
          <Ionicons name={getMarkerIcon(clinic.type)} size={20} color="#FFF" />
        </View>
      </Marker>
    );
  };

  // Função para buscar no JSON todos os estabelecimentos do tipo selecionado
  const handleSearchAllClinics = async () => {
    if (!location) return;
    const allData = getEstablishmentsByType(selectedType);
    const nearby = getNearbyEstablishments(allData, location);
    setAllClinics(nearby);
    setSearchInAll(true);
  };

  // Função para calcular similaridade (Levenshtein Distance)
  function getLevenshteinDistance(a, b) {
    if (!a || !b) return Math.max((a || '').length, (b || '').length);
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substituição
            matrix[i][j - 1] + 1,     // inserção
            matrix[i - 1][j] + 1      // deleção
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Função para verificar se o nome é "parecido o suficiente"
  function isSimilarName(name, search, maxDistance = 3) {
    if (!name || !search) return false;
    const n = name.toLowerCase();
    const s = search.toLowerCase();
    if (n.includes(s)) return true;
    return getLevenshteinDistance(n, s) <= maxDistance;
  }

  // Função para busca fuzzy em múltiplos campos (nome, endereço, bairro)
  function isSimilarClinic(clinic, search, maxDistance = 3) {
    if (!clinic || !search) return false;
    const name = ensureString(clinic.name);
    const address = ensureString(clinic.address);
    const bairro = clinic.address ? clinic.address.split('-')[1] || '' : '';
    const s = search.toLowerCase();
    return (
      isSimilarName(name, search, maxDistance) ||
      isSimilarName(address, search, maxDistance) ||
      isSimilarName(bairro, search, maxDistance)
    );
  }

  // Filtro de tipo aplicado na lista
  function filterByType(clinic) { return true; }

  // Substituir o filtro de busca para considerar o tipo selecionado
  let filteredClinics = [];
  if (searchText.trim().length > 0 && searchInAll) {
    filteredClinics = allClinics.filter(clinic =>
      validateCoordinates(clinic.coordinate) &&
      filterByType(clinic) &&
      isSimilarClinic(clinic, searchText)
    );
  } else if (searchText.trim().length > 0) {
    filteredClinics = clinics.filter(clinic =>
      validateCoordinates(clinic.coordinate) &&
      filterByType(clinic) &&
      isSimilarClinic(clinic, searchText)
    );
  } else if (searchInAll) {
    filteredClinics = allClinics.filter(clinic => validateCoordinates(clinic.coordinate) && filterByType(clinic));
  } else {
    filteredClinics = clinics.filter(clinic => validateCoordinates(clinic.coordinate) && filterByType(clinic));
  }

  // Fallback: se nenhum estabelecimento for encontrado após filtro, mostrar todos
  if (filteredClinics.length === 0 && !searchText.trim()) {
    console.log('[DEBUG] Nenhum estabelecimento encontrado após filtro, mostrando todos');
    filteredClinics = clinics.filter(clinic => validateCoordinates(clinic.coordinate));
  }

  // Sempre que o campo de busca for limpo, volta ao modo padrão
  useEffect(() => {
    if (searchText.trim().length === 0 && searchInAll) {
      setSearchInAll(false);
      setAllClinics([]);
    }
  }, [searchText]);

  // Adicionar log para depuração
  useEffect(() => {
    if (allClinics.length > 0) {
      console.log(`[DEBUG] Total de nutricionistas carregados do JSON: ${allClinics.length}`);
      if (filteredClinics.length > 0) {
        console.log('[DEBUG] Exemplo de resultado encontrado:', filteredClinics[0]);
      } else {
        console.log('[DEBUG] Nenhum resultado encontrado para o filtro atual.');
      }
    }
  }, [allClinics, filteredClinics]);

  // Função para trocar tipo à esquerda
  const handlePrevType = () => {
    setSelectedTypeIndex((prev) => (prev - 1 + types.length) % types.length);
  };
  // Função para trocar tipo à direita
  const handleNextType = () => {
    setSelectedTypeIndex((prev) => (prev + 1) % types.length);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E8331" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Carregando mapa...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color="#FF3B30" />
          <Text style={[styles.errorText, { color: textColor }]}>
            {errorMsg}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Campo de busca */}
      <View style={{ padding: 16, backgroundColor }}>
        <TextInput
          style={{
            backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#FFF',
            color: textColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#2E8331',
            fontSize: 16,
          }}
          placeholder="Buscar nutricionista pelo nome..."
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={getValidRegion(location, filteredClinics)}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          onMapReady={() => {
            console.log('Mapa carregado com sucesso');
            // Ajusta a região para mostrar todas as clínicas
            if (location && filteredClinics.length > 0) {
              const region = getValidRegion(location, filteredClinics);
              mapRef.current?.animateToRegion(region, 1000);
            }
          }}
        >
          {/* Marcador da localização do usuário */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua localização"
              description="Você está aqui"
              pinColor="#2E8331"
            />
          )}

          {/* Marcadores das clínicas validadas */}
          {filteredClinics
            .filter(clinic => validateCoordinates(clinic.coordinate))
            .map((clinic) => (
              <ValidatedMarker
                key={clinic.id}
                clinic={clinic}
                onPress={handleMarkerPress}
              />
            ))}
        </MapView>

        {/* Botão de localização atual */}
        <TouchableOpacity style={styles.locationButton} onPress={handleMyLocation}>
          <Ionicons name="locate" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Indicador de erro da API */}
        {apiError && (
          <View style={styles.apiErrorContainer}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.apiErrorText}>Dados de exemplo</Text>
          </View>
        )}
      </View>

      {/* Lista de clínicas filtradas */}
      <View style={[styles.clinicsContainer, { backgroundColor }]}>
        <View style={styles.clinicsHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={handlePrevType} style={{ padding: 8 }}>
              <Ionicons name="chevron-back" size={28} color="#2E8331" />
            </TouchableOpacity>
            <Text style={[styles.clinicsTitle, { color: '#2E8331', marginHorizontal: 8 }]}> 
              {types[selectedTypeIndex] ? types[selectedTypeIndex].label : types[0].label}
            </Text>
            <TouchableOpacity onPress={handleNextType} style={{ padding: 8 }}>
              <Ionicons name="chevron-forward" size={28} color="#2E8331" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.clinicsSubtitle, { color: textColor }]}> 
            {filteredClinics.length} encontrados
          </Text>
        </View>
        
        <ScrollView 
          style={styles.clinicsList} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2E8331']}
              tintColor="#2E8331"
            />
          }
        >
          {filteredClinics.length === 0 && searchText.trim().length > 0 && !searchInAll ? (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: textColor, textAlign: 'center', marginBottom: 12 }}>
                Nenhuma clínica encontrada próxima com esse nome.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#2E8331',
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={handleSearchAllClinics}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
                  {`Buscar por lista de ${types[selectedTypeIndex] ? types[selectedTypeIndex].label.toLowerCase() : 'clínicas'}`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : filteredClinics.length === 0 && searchInAll ? (
            <Text style={{ color: textColor, textAlign: 'center', marginTop: 24 }}>
              Nenhuma clínica encontrada na lista de clínicas.
            </Text>
          ) : (
            filteredClinics.map((clinic) => (
              <TouchableOpacity
                key={clinic.id}
                style={[
                  styles.clinicCard,
                  selectedClinic?.id === clinic.id && styles.selectedClinicCard
                ]}
                onPress={() => {
                  handleMarkerPress(clinic);
                  // Centraliza o mapa na clínica/hospital ao clicar no card
                  if (clinic.coordinate && mapRef.current && validateCoordinates(clinic.coordinate)) {
                    mapRef.current.animateToRegion({
                      latitude: clinic.coordinate.latitude,
                      longitude: clinic.coordinate.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }, 1000);
                  }
                }}
              >
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicInfo}>
                    <Text style={[styles.clinicName, { color: textColor }]}>
                      {clinic.name || 'Clínica'}
                    </Text>
                    <View style={styles.clinicTypeContainer}>
                      <Ionicons 
                        name={getMarkerIcon(clinic.type)} 
                        size={16} 
                        color={getMarkerColor(clinic.type)} 
                      />
                      <Text style={[styles.clinicType, { color: getMarkerColor(clinic.type) }]}>
                        {clinic.type || 'Estabelecimento de saúde'}
                      </Text>
                      {clinic.distance && (
                        <Text style={[styles.distanceText, { color: textColor }]}>
                          • {formatDistance(clinic.distance)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.ratingContainer}>
                    {clinic.rating > 0 && (
                      <>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: textColor }]}>
                          {clinic.rating.toFixed(1)}
                        </Text>
                        {clinic.totalRatings > 0 && (
                          <Text style={[styles.totalRatingsText, { color: textColor }]}>
                            ({clinic.totalRatings})
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                </View>
                
                <Text style={[styles.clinicAddress, { color: textColor }]}>
                  {clinic.address || 'Endereço não informado'}
                </Text>
                
                <Text style={[styles.clinicDescription, { color: textColor }]}>
                  {clinic.description || 'Descrição não disponível'}
                </Text>

                {/* Exibe o website se existir */}
                {clinic.website && clinic.website.trim() !== '' && (
                  <Text
                    style={{ color: '#2E8331', textDecorationLine: 'underline', marginBottom: 4 }}
                    onPress={() => Linking.openURL(clinic.website)}
                  >
                    {clinic.website}
                  </Text>
                )}

                <View style={styles.clinicStatus}>
                  <View style={[
                    styles.statusIndicator, 
                    { backgroundColor: clinic.openingHours === 'Aberto agora' ? '#4CAF50' : '#F44336' }
                  ]} />
                  <Text style={[styles.statusText, { color: textColor }]}>
                    {clinic.openingHours || 'Horário não informado'}
                  </Text>
                </View>

                <View style={styles.clinicActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => handleCallClinic(clinic.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>
                      {clinic.phone ? 'Ligar' : 'Sem telefone'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.navigateButton]}
                    onPress={() => handleNavigateToClinic(clinic)}
                  >
                    <Ionicons name="navigate" size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>Navegar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2E8331',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  apiErrorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  apiErrorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clinicsContainer: {
    height: SCREEN_HEIGHT * 0.4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  clinicsHeader: {
    marginBottom: 15,
  },
  clinicsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clinicsSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  clinicsList: {
    flex: 1,
  },
  clinicCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  selectedClinicCard: {
    borderWidth: 2,
    borderColor: '#2E8331',
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clinicTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  clinicType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  totalRatingsText: {
    fontSize: 12,
    marginLeft: 2,
    opacity: 0.7,
  },
  clinicAddress: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  clinicDescription: {
    fontSize: 13,
    marginBottom: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  clinicStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clinicActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#2E8331',
  },
  navigateButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2E8331',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 