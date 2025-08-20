import axios from "axios";
import { API_CONFIG, validateApiConfig } from "../config/apiKeys";

let realClinicsDataCache: any = null;

const loadRealClinicsData = async () => {
  if (realClinicsDataCache) {
    console.log("Retornando dados do cache");
    return realClinicsDataCache;
  }

  try {
    console.log("Carregando dados de clínicas do arquivo JSON...");
    const data = require("./realClinicsData.json");
    console.log("Arquivo JSON importado com sucesso");
    console.log("Estrutura dos dados:", Object.keys(data));
    console.log("Número de clínicas:", data.clinics.length);
    console.log("Primeira clínica:", data.clinics[0]);
    realClinicsDataCache = data;
    console.log("Dados de clínicas carregados com sucesso");
    return realClinicsDataCache;
  } catch (error) {
    console.error("Erro ao carregar dados de clínicas:", error);
    throw error;
  }
};

export const searchNearbyClinics = async (
  latitude: number,
  longitude: number,
  radius: number = API_CONFIG.DEFAULT_SEARCH_RADIUS,
) => {
  try {
    const apiValidation = validateApiConfig();
    if (!apiValidation.isValid) throw new Error("Configuração da API inválida");

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

    const osmResponse = await axios.get("https://overpass-api.de/api/interpreter", {
      params: { data: overpassQuery },
      timeout: API_CONFIG.REQUEST_TIMEOUT,
    });

    const osmClinics = processOSMData(osmResponse.data, latitude, longitude);

    if (osmClinics.length < 3) {
      const susClinics = await searchSUSClinics(latitude, longitude, radius);
      osmClinics.push(...susClinics);
    }

    const uniqueClinics = removeDuplicates(osmClinics);
    const sortedClinics = uniqueClinics
      .sort((a, b) => a.distance - b.distance)
      .slice(0, API_CONFIG.MAX_CLINICS_RESULTS);

    if (sortedClinics.length < 3) {
      const fallbackData = await getFallbackClinics();
      const fallbackWithDistance = fallbackData.map((clinic: any) => ({
        ...clinic,
        distance: calculateDistance(
          latitude,
          longitude,
          clinic.coordinate.latitude,
          clinic.coordinate.longitude,
        ),
      }));

      const combinedClinics = [...sortedClinics, ...fallbackWithDistance];
      return removeDuplicates(combinedClinics)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, API_CONFIG.MAX_CLINICS_RESULTS);
    }

    return sortedClinics;
  } catch (error) {
    console.error("Erro ao buscar clínicas reais:", error);

    const fallbackData = await getFallbackClinics();
    const fallbackWithDistance = fallbackData.map((clinic: any) => ({
      ...clinic,
      distance: calculateDistance(latitude, longitude, clinic.coordinate.latitude, clinic.coordinate.longitude),
    }));

    return fallbackWithDistance.sort((a, b) => a.distance - b.distance).slice(0, API_CONFIG.MAX_CLINICS_RESULTS);
  }
};

const processOSMData = (osmData: any, userLat: number, userLng: number) => {
  const clinics: any[] = [];
  if (!osmData.elements) return clinics;

  osmData.elements.forEach((element: any) => {
    if (element.type === "node" && element.tags) {
      const clinic = processOSMElement(element, userLat, userLng);
      if (clinic) clinics.push(clinic);
    }
  });
  return clinics;
};

const processOSMElement = (element: any, userLat: number, userLng: number) => {
  const tags = element.tags;
  const type = determineClinicType(tags);
  if (!type) return null;

  const distance = calculateDistance(userLat, userLng, element.lat, element.lon);
  const address = generateAddress(tags, element.lat, element.lon);

  return {
    id: `osm_${element.id}`,
    name: tags.name || tags["name:pt"] || "Clínica",
    type,
    address,
    phone: tags.phone || tags.contact_phone || "",
    website: tags.website || tags.contact_website || "",
    rating: 0,
    totalRatings: 0,
    coordinate: { latitude: element.lat, longitude: element.lon },
    distance,
    description: generateDescriptionFromTags(tags, type),
    openingHours: tags.opening_hours || "Horário não informado",
    photos: [],
    isRealData: true,
  };
};

const determineClinicType = (tags: any): string | null => {
  const name = (tags.name || "").toLowerCase();
  const healthcare = tags.healthcare || "";
  const amenity = tags.amenity || "";

  const nutritionistKeywords = [
    "nutricionista",
    "nutrição",
    "nutri",
    "dieta",
    "alimentação",
    "nutrição clínica",
    "nutrição esportiva",
    "nutrição funcional",
  ];

  if (nutritionistKeywords.some((keyword) => name.includes(keyword))) return "Nutricionista";
  if (healthcare === "clinic" || healthcare === "doctor") return "Clínica Médica";
  if (healthcare === "hospital") return "Posto de Saúde";
  if (amenity === "clinic") return "Clínica Médica";
  if (amenity === "hospital") return "Posto de Saúde";
  if (healthcare || amenity === "clinic" || amenity === "hospital") return "Clínica Médica";
  return null;
};

const generateAddress = (tags: any, lat: number, lon: number) => {
  const parts: string[] = [];
  if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
  if (tags["addr:street"]) parts.push(tags["addr:street"]);
  if (tags["addr:city"]) parts.push(tags["addr:city"]);
  if (tags["addr:state"]) parts.push(tags["addr:state"]);
  if (parts.length > 0) return parts.join(", ");
  return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
};

const generateDescriptionFromTags = (tags: any, type: string) => {
  const descriptions: Record<string, string> = {
    Nutricionista: "Especializada em nutrição e alimentação saudável",
    "Posto de Saúde": "Unidade de saúde com atendimento básico",
    "Clínica Médica": "Clínica médica com diversos especialistas",
  };
  return descriptions[type] || "Estabelecimento de saúde";
};

const searchSUSClinics = async (latitude: number, longitude: number, radius: number) => {
  try {
    await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/municipios", {
      timeout: API_CONFIG.REQUEST_TIMEOUT,
    });
    return [];
  } catch (error) {
    console.warn("Erro ao buscar dados do SUS:", error);
    return [];
  }
};

const removeDuplicates = (clinics: any[]) => {
  const unique: any[] = [];
  const seen = new Set<string>();

  clinics.forEach((clinic) => {
    const key = `${clinic.coordinate.latitude.toFixed(4)}_${clinic.coordinate.longitude.toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(clinic);
    }
  });

  return unique;
};

export const searchClinicsByAddress = async (address: string) => {
  try {
    const geocodeResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json", limit: 1, countrycodes: "br" },
      timeout: API_CONFIG.REQUEST_TIMEOUT,
    });

    if (geocodeResponse.data.length > 0) {
      const location = geocodeResponse.data[0];
      return await searchNearbyClinics(parseFloat(location.lat), parseFloat(location.lon));
    }

    return getFallbackClinics();
  } catch (error) {
    console.error("Erro ao buscar clínicas por endereço:", error);
    return getFallbackClinics();
  }
};

const R = 6371e3;
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dphi / 2) * Math.sin(dphi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) * Math.sin(dlambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function splitUppercaseWords(str?: string) {
  if (!str) return "";
  return str
    .replace(/([A-Z]{2,})/g, " $1")
    .replace(/([0-9]+)/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getFallbackClinics() {
  try {
    const data = require("./nutricionistas_sao_paulo.json");
    return data.map((item: any, idx: number) => ({
      id: item.CO_CNES || `nutri_${idx}`,
      name:
        splitUppercaseWords(item.NO_FANTASIA) || splitUppercaseWords(item.NO_RAZAO_SOCIAL) || "Nutricionista",
      type: "Nutricionista",
      address: `${splitUppercaseWords(item.NO_LOGRADOURO)}, ${item.NU_ENDERECO || ""} - ${splitUppercaseWords(
        item.NO_BAIRRO,
      )}, São Paulo - SP, ${item.CO_CEP || ""}`
        .replace(/\s+/g, " ")
        .trim(),
      phone: item.NU_TELEFONE || "",
      website: "",
      rating: 0,
      totalRatings: 0,
      coordinate: { latitude: parseFloat(item.NU_LATITUDE), longitude: parseFloat(item.NU_LONGITUDE) },
      description: "",
      openingHours: item.DS_TURNO_ATENDIMENTO || "",
      isRealData: true,
    }));
  } catch (e) {
    console.error("Erro ao carregar nutricionistas:", e);
    return [] as any[];
  }
}
