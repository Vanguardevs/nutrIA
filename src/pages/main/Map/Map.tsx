import React, { useState, useEffect, useRef } from "react";
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
  TextInput,
} from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { searchNearbyClinics, getFallbackClinics } from "../../../utils/clinicsAPI";
import realClinicsData from "../../../utils/realClinicsData.json";
import nutricionistasData from "../../../utils/nutricionistas_sao_paulo.json";
import { useFocusEffect } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type Coordinate = { latitude: number; longitude: number };

type Clinic = {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  openingHours: string;
  phone: string;
  website: string;
  rating: number;
  totalRatings: number;
  coordinate: Coordinate;
  distance?: number;
  [key: string]: any;
};

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);
  const mapRef = useRef<MapView | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [searchInAll, setSearchInAll] = useState<boolean>(false);
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(2);

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";

  const types = [
    { key: "clinica", label: "Clínicas Próximas" },
    { key: "hospital", label: "Hospitais Próximos" },
    { key: "nutricionista", label: "Nutricionistas Próximos" },
  ];
  const selectedType = types[selectedTypeIndex] ? types[selectedTypeIndex].key : types[0].key;

  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const ensureNumber = (value: any): number => {
    if (value === null || value === undefined || isNaN(Number(value))) return 0;
    return Number(value);
  };

  const validateCoordinates = (coordinate: any): coordinate is Coordinate => {
    if (!coordinate || typeof coordinate !== "object") return false;

    const lat = parseFloat(coordinate.latitude);
    const lng = parseFloat(coordinate.longitude);

    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    if (lat < -40 || lat > 10 || lng < -80 || lng > -20) {
      console.warn(`Coordenadas suspeitas: ${lat}, ${lng}`);
      return false;
    }
    return true;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const fetchCoordinatesFromAddress = async (address: string): Promise<Coordinate | null> => {
    try {
      console.log("[Geocode] Buscando coordenadas para endereço:", address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        console.log("[Geocode] Resultado:", data[0].display_name, "Lat:", data[0].lat, "Lon:", data[0].lon);
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
      console.warn("[Geocode] Nenhum resultado encontrado para:", address);
      return null;
    } catch (error) {
      console.warn("Erro ao buscar coordenadas pelo endereço:", error);
      return null;
    }
  };

  const sanitizeClinicsData = async (
    clinicsInput: any[],
    userLocation: Location.LocationObject | null = null,
  ) => {
    return Promise.all(
      clinicsInput.map(async (clinic: any): Promise<Clinic | null> => {
        let coord = clinic.coordinate;
        if (!validateCoordinates(coord) && clinic.address) {
          const fetchedCoord = await fetchCoordinatesFromAddress(clinic.address);
          if (fetchedCoord && validateCoordinates(fetchedCoord)) {
            coord = fetchedCoord;
          } else {
            console.warn(`Não foi possível geocodificar: ${clinic.name}`);
            return null;
          }
        }
        const sanitized: Clinic = {
          ...clinic,
          id: ensureString(clinic.id),
          name: ensureString(clinic.name) || "Clínica",
          type: ensureString(clinic.type) || "Estabelecimento de saúde",
          address: ensureString(clinic.address) || "Endereço não informado",
          description: ensureString(clinic.description) || "Descrição não disponível",
          openingHours: ensureString(clinic.openingHours) || "Horário não informado",
          phone: ensureString(clinic.phone),
          website: ensureString(clinic.website),
          rating: ensureNumber(clinic.rating),
          totalRatings: ensureNumber(clinic.totalRatings),
          coordinate: {
            latitude: parseFloat(coord.latitude),
            longitude: parseFloat(coord.longitude),
          },
        };
        if (userLocation) {
          sanitized.distance = calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            sanitized.coordinate.latitude,
            sanitized.coordinate.longitude,
          );
        }
        return sanitized;
      }),
    ).then((results) =>
      (results.filter((clinic): clinic is Clinic => clinic !== null) as Clinic[]).sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      }),
    );
  };

  const fetchClinics = async (userLocation: Location.LocationObject) => {
    try {
      setApiError(false);
      console.log("Buscando clínicas próximas...");
      const clinicsData: any[] = await searchNearbyClinics(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        5000,
      );
      const sanitizedClinics = await sanitizeClinicsData(clinicsData, userLocation);
      setClinics(sanitizedClinics);
    } catch (error) {
      console.error("Erro ao buscar clínicas da API:", error);
      setApiError(true);
      const fallbackData: any[] = await getFallbackClinics();
      const sanitizedFallback = await sanitizeClinicsData(fallbackData, userLocation);
      setClinics(sanitizedFallback);
      Alert.alert("Aviso", "Não foi possível carregar clínicas reais. Mostrando dados de exemplo.", [
        { text: "OK" },
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchClinics(location);
    }
    setRefreshing(false);
  };

  const getEstablishmentsByType = (type: string): Clinic[] => {
    if (type === "nutricionista") {
      return (nutricionistasData as any[])
        .filter((clinic: any) =>
          validateCoordinates(
            clinic.coordinate || { latitude: clinic.NU_LATITUDE, longitude: clinic.NU_LONGITUDE },
          ),
        )
        .map(
          (item: any, idx: number): Clinic => ({
            id: item.CO_CNES || `nutri_${idx}`,
            name: item.NO_FANTASIA || item.NO_RAZAO_SOCIAL || "Nutricionista",
            type: "Nutricionista",
            address: `${item.NO_LOGRADOURO || ""}, ${item.NU_ENDERECO || ""} - ${
              item.NO_BAIRRO || ""
            }, São Paulo - SP, ${item.CO_CEP || ""}`
              .replace(/\s+/g, " ")
              .trim(),
            phone: item.NU_TELEFONE || "",
            website: "",
            rating: 0,
            totalRatings: 0,
            coordinate: { latitude: parseFloat(item.NU_LATITUDE), longitude: parseFloat(item.NU_LONGITUDE) },
            description: "",
            openingHours: item.DS_TURNO_ATENDIMENTO || "",
            isRealData: false,
          }),
        );
    } else {
      return ((realClinicsData as any).clinics || []).filter((clinic: any) => {
        if (!validateCoordinates(clinic.coordinate)) return false;
        const name = ensureString(clinic.name).toLowerCase();
        const desc = ensureString(clinic.description).toLowerCase();
        const typeField = ensureString(clinic.type).toLowerCase();
        if (type === "hospital") {
          return name.includes("hospital") || desc.includes("hospital");
        }
        if (type === "clinica") {
          const isHospital = name.includes("hospital") || desc.includes("hospital");
          const isPosto = typeField.includes("posto");
          return !isHospital && (typeField.includes("clínica") || typeField.includes("clinica")) && !isPosto;
        }
        return false;
      });
    }
  };

  const getNearbyEstablishments = (
    establishments: Clinic[] | any[],
    userLocation: Location.LocationObject | null,
    maxDistanceMeters = 15000,
  ): Clinic[] => {
    if (!userLocation) return [];
    return establishments
      .map((est: any) => {
        const lat = est.coordinate
          ? est.coordinate.latitude
          : est.NU_LATITUDE
          ? parseFloat(est.NU_LATITUDE)
          : null;
        const lng = est.coordinate
          ? est.coordinate.longitude
          : est.NU_LONGITUDE
          ? parseFloat(est.NU_LONGITUDE)
          : null;
        if (lat === null || lng === null) return null;
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          lat,
          lng,
        );
        return { ...(est as any), distance } as Clinic;
      })
      .filter(
        (est: Clinic | null): est is Clinic => Boolean(est) && (est as Clinic).distance! <= maxDistanceMeters,
      )
      .sort((a: Clinic, b: Clinic) => a.distance! - b.distance!);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      setLoading(true);
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            if (isActive) {
              setErrorMsg("Permissão para acessar localização foi negada");
              setLoading(false);
            }
            return;
          }
          const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          if (isActive) {
            setLocation(currentLocation);
            const allData = getEstablishmentsByType(selectedType);
            const nearby = getNearbyEstablishments(allData, currentLocation);
            setClinics(nearby);
          }
        } catch (error) {
          if (isActive) {
            setErrorMsg("Erro ao obter localização");
            setClinics([]);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [selectedType]),
  );

  const handleMarkerPress = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCallClinic = (phone?: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert("Informação", "Telefone não disponível para esta clínica.");
    }
  };

  const handleNavigateToClinic = (clinic: Clinic) => {
    const { latitude, longitude } = clinic.coordinate;
    const url = `https://www.openstreetmap.org/directions?from=&to=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  const getMarkerIcon = (type: string) => {
    if (selectedType === "nutricionista") return "restaurant";
    if (selectedType === "hospital") return "medkit";
    return "medical";
  };

  const getMarkerColor = (type: string) => {
    if (selectedType === "nutricionista") return "#2E8331";
    if (selectedType === "hospital") return "#007AFF";
    return "#007AFF";
  };

  const formatDistance = (distance?: number) => {
    const cleanDistance = ensureNumber(distance);
    if (cleanDistance === 0) {
      return "Distância não disponível";
    }
    if (cleanDistance < 1000) {
      return `${Math.round(cleanDistance)}m`;
    } else {
      return `${(cleanDistance / 1000).toFixed(1)}km`;
    }
  };

  const getValidRegion = (loc: Location.LocationObject | null, items: Clinic[]): Region => {
    if (!loc) {
      return { latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.1, longitudeDelta: 0.1 };
    }

    let minLat = loc.coords.latitude;
    let maxLat = loc.coords.latitude;
    let minLng = loc.coords.longitude;
    let maxLng = loc.coords.longitude;

    items.forEach((clinic) => {
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

  const ValidatedMarker = ({ clinic, onPress }: { clinic: Clinic; onPress: (c: Clinic) => void }) => {
    if (!validateCoordinates(clinic.coordinate)) {
      return null;
    }
    return (
      <Marker
        coordinate={clinic.coordinate}
        title={clinic.name}
        description={`${clinic.type} - ${formatDistance(clinic.distance)}`}
        onPress={() => onPress(clinic)}
      >
        <View style={[styles.customMarker, { backgroundColor: getMarkerColor(clinic.type) }]}>
          <Ionicons name={getMarkerIcon(clinic.type) as any} size={20} color="#FFF" />
        </View>
      </Marker>
    );
  };

  const handleSearchAllClinics = async () => {
    if (!location) return;
    const allData = getEstablishmentsByType(selectedType);
    const nearby = getNearbyEstablishments(allData, location);
    setAllClinics(nearby);
    setSearchInAll(true);
  };

  function getLevenshteinDistance(a?: string, b?: string) {
    if (!a || !b) return Math.max((a || "").length, (b || "").length);
    const matrix: number[][] = [];
    let i: number;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    let j: number;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function isSimilarName(name?: string, search?: string, maxDistance = 3) {
    if (!name || !search) return false;
    const n = name.toLowerCase();
    const s = search.toLowerCase();
    if (n.includes(s)) return true;
    return getLevenshteinDistance(n, s) <= maxDistance;
  }

  function isSimilarClinic(clinic: Clinic | any, search: string, maxDistance = 3) {
    if (!clinic || !search) return false;
    const name = ensureString(clinic.name);
    const address = ensureString(clinic.address);
    const bairro = clinic.address ? clinic.address.split("-")[1] || "" : "";
    return (
      isSimilarName(name, search, maxDistance) ||
      isSimilarName(address, search, maxDistance) ||
      isSimilarName(bairro, search, maxDistance)
    );
  }

  function filterByType(_clinic: Clinic) {
    return true;
  }

  let filteredClinics: Clinic[] = [];
  if (searchText.trim().length > 0 && searchInAll) {
    filteredClinics = allClinics.filter(
      (clinic) =>
        validateCoordinates(clinic.coordinate) && filterByType(clinic) && isSimilarClinic(clinic, searchText),
    );
  } else if (searchText.trim().length > 0) {
    filteredClinics = clinics.filter(
      (clinic) =>
        validateCoordinates(clinic.coordinate) && filterByType(clinic) && isSimilarClinic(clinic, searchText),
    );
  } else if (searchInAll) {
    filteredClinics = allClinics.filter(
      (clinic) => validateCoordinates(clinic.coordinate) && filterByType(clinic),
    );
  } else {
    filteredClinics = clinics.filter((clinic) => validateCoordinates(clinic.coordinate) && filterByType(clinic));
  }

  if (filteredClinics.length === 0 && !searchText.trim()) {
    console.log("[DEBUG] Nenhum estabelecimento encontrado após filtro, mostrando todos");
    filteredClinics = clinics.filter((clinic) => validateCoordinates(clinic.coordinate));
  }

  useEffect(() => {
    if (searchText.trim().length === 0 && searchInAll) {
      setSearchInAll(false);
      setAllClinics([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (allClinics.length > 0) {
      // Debug logs intentionally left
    }
  }, [allClinics, filteredClinics]);

  const handlePrevType = () => {
    setSelectedTypeIndex((prev) => (prev - 1 + types.length) % types.length);
  };
  const handleNextType = () => {
    setSelectedTypeIndex((prev) => (prev + 1) % types.length);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E8331" />
          <Text style={[styles.loadingText, { color: textColor }]}>Carregando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color="#FF3B30" />
          <Text style={[styles.errorText, { color: textColor }]}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              try {
                (globalThis as any).location?.reload?.();
              } catch {}
            }}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={{ padding: 16, backgroundColor }}>
        <TextInput
          style={{
            backgroundColor: colorScheme === "dark" ? "#2C2C2E" : "#FFF",
            color: textColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#2E8331",
            fontSize: 16,
          }}
          placeholder="Buscar nutricionista pelo nome..."
          placeholderTextColor={colorScheme === "dark" ? "#888" : "#aaa"}
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
            console.log("Mapa carregado com sucesso");
            if (location && filteredClinics.length > 0) {
              const region = getValidRegion(location, filteredClinics);
              mapRef.current?.animateToRegion(region, 1000);
            }
          }}
        >
          {location && (
            <Marker
              coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
              title="Sua localização"
              description="Você está aqui"
              pinColor="#2E8331"
            />
          )}

          {filteredClinics
            .filter((clinic) => validateCoordinates(clinic.coordinate))
            .map((clinic) => (
              <ValidatedMarker key={clinic.id} clinic={clinic} onPress={handleMarkerPress} />
            ))}
        </MapView>

        <TouchableOpacity style={styles.locationButton} onPress={handleMyLocation}>
          <Ionicons name="locate" size={24} color="#FFF" />
        </TouchableOpacity>

        {apiError && (
          <View style={styles.apiErrorContainer}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.apiErrorText}>Dados de exemplo</Text>
          </View>
        )}
      </View>

      <View style={[styles.clinicsContainer, { backgroundColor }]}>
        <View style={styles.clinicsHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={handlePrevType} style={{ padding: 8 }}>
              <Ionicons name="chevron-back" size={28} color="#2E8331" />
            </TouchableOpacity>
            <Text style={[styles.clinicsTitle, { color: "#2E8331", marginHorizontal: 8 }]}>
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
              colors={["#2E8331"]}
              tintColor="#2E8331"
            />
          }
        >
          {filteredClinics.length === 0 && searchText.trim().length > 0 && !searchInAll ? (
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Text style={{ color: textColor, textAlign: "center", marginBottom: 12 }}>
                Nenhuma clínica encontrada próxima com esse nome.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2E8331",
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={handleSearchAllClinics}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
                  {`Buscar por lista de ${
                    types[selectedTypeIndex] ? types[selectedTypeIndex].label.toLowerCase() : "clínicas"
                  }`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : filteredClinics.length === 0 && searchInAll ? (
            <Text style={{ color: textColor, textAlign: "center", marginTop: 24 }}>
              Nenhuma clínica encontrada na lista de clínicas.
            </Text>
          ) : (
            filteredClinics.map((clinic) => (
              <TouchableOpacity
                key={clinic.id}
                style={[styles.clinicCard, selectedClinic?.id === clinic.id && styles.selectedClinicCard]}
                onPress={() => {
                  handleMarkerPress(clinic);
                  if (clinic.coordinate && mapRef.current && validateCoordinates(clinic.coordinate)) {
                    mapRef.current.animateToRegion(
                      {
                        latitude: clinic.coordinate.latitude,
                        longitude: clinic.coordinate.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      },
                      1000,
                    );
                  }
                }}
              >
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicInfo}>
                    <Text style={[styles.clinicName, { color: textColor }]}>{clinic.name || "Clínica"}</Text>
                    <View style={styles.clinicTypeContainer}>
                      <Ionicons
                        name={getMarkerIcon(clinic.type) as any}
                        size={16}
                        color={getMarkerColor(clinic.type)}
                      />
                      <Text style={[styles.clinicType, { color: getMarkerColor(clinic.type) }]}>
                        {clinic.type || "Estabelecimento de saúde"}
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
                        <Text style={[styles.ratingText, { color: textColor }]}>{clinic.rating.toFixed(1)}</Text>
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
                  {clinic.address || "Endereço não informado"}
                </Text>

                <Text style={[styles.clinicDescription, { color: textColor }]}>
                  {clinic.description || "Descrição não disponível"}
                </Text>

                {clinic.website && clinic.website.trim() !== "" && (
                  <Text
                    style={{ color: "#2E8331", textDecorationLine: "underline", marginBottom: 4 }}
                    onPress={() => Linking.openURL(clinic.website)}
                  >
                    {clinic.website}
                  </Text>
                )}

                <View style={styles.clinicStatus}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: clinic.openingHours === "Aberto agora" ? "#4CAF50" : "#F44336" },
                    ]}
                  />
                  <Text style={[styles.statusText, { color: textColor }]}>
                    {clinic.openingHours || "Horário não informado"}
                  </Text>
                </View>

                <View style={styles.clinicActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => handleCallClinic(clinic.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>{clinic.phone ? "Ligar" : "Sem telefone"}</Text>
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
  container: { flex: 1 },
  mapContainer: { flex: 1, position: "relative" },
  map: { flex: 1 },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2E8331",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  apiErrorContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(255, 149, 0, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  apiErrorText: { color: "#FFF", fontSize: 12, fontWeight: "600", marginLeft: 4 },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  clinicsHeader: { marginBottom: 15 },
  clinicsTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  clinicsSubtitle: { fontSize: 14, textAlign: "center", marginTop: 4, opacity: 0.7 },
  clinicsList: { flex: 1 },
  clinicCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  selectedClinicCard: { borderWidth: 2, borderColor: "#2E8331" },
  clinicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  clinicTypeContainer: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  clinicType: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
  distanceText: { fontSize: 14, marginLeft: 8, opacity: 0.7 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
  totalRatingsText: { fontSize: 12, marginLeft: 2, opacity: 0.7 },
  clinicAddress: { fontSize: 14, marginBottom: 8, opacity: 0.8 },
  clinicDescription: { fontSize: 13, marginBottom: 8, opacity: 0.7, fontStyle: "italic" },
  clinicStatus: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: "500" },
  clinicActions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  callButton: { backgroundColor: "#2E8331" },
  navigateButton: { backgroundColor: "#007AFF" },
  actionButtonText: { color: "#FFF", fontSize: 14, fontWeight: "600", marginLeft: 4 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  errorText: { fontSize: 16, textAlign: "center", marginTop: 16, marginBottom: 24 },
  retryButton: { backgroundColor: "#2E8331", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
