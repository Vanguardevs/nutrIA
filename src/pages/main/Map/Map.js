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
  RefreshControl
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { searchNearbyClinics, searchClinicsByAddress, getFallbackClinics } from '../../../utils/clinicsAPI';

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

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2';
  const textColor = colorScheme === 'dark' ? '#F2F2F2' : '#1C1C1E';

  // Função para buscar clínicas usando a API real
  const fetchClinics = async (userLocation) => {
    try {
      setApiError(false);
      const clinicsData = await searchNearbyClinics(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        5000 // 5km de raio
      );
      setClinics(clinicsData);
    } catch (error) {
      console.error('Erro ao buscar clínicas da API:', error);
      setApiError(true);
      // Usa dados de fallback se a API falhar
      const fallbackData = getFallbackClinics();
      setClinics(fallbackData);
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Solicita permissões de localização
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão para acessar localização foi negada');
          setLoading(false);
          return;
        }

        // Obtém a localização atual
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);
        
        // Busca clínicas usando a API real
        await fetchClinics(currentLocation);

      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setErrorMsg('Erro ao obter localização');
        // Em caso de erro, usa dados de fallback
        const fallbackData = getFallbackClinics();
        setClinics(fallbackData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    return type === 'Nutricionista' ? 'restaurant' : 'medical';
  };

  const getMarkerColor = (type) => {
    return type === 'Nutricionista' ? '#2E8331' : '#007AFF';
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
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
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          // Remove PROVIDER_GOOGLE para usar OpenStreetMap (padrão)
          initialRegion={{
            latitude: location?.coords?.latitude || -23.5505,
            longitude: location?.coords?.longitude || -46.6333,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
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

          {/* Marcadores das clínicas */}
          {clinics.map((clinic) => (
            <Marker
              key={clinic.id}
              coordinate={clinic.coordinate}
              title={clinic.name}
              description={clinic.type}
              onPress={() => handleMarkerPress(clinic)}
            >
              <View style={[styles.customMarker, { backgroundColor: getMarkerColor(clinic.type) }]}>
                <Ionicons name={getMarkerIcon(clinic.type)} size={20} color="#FFF" />
              </View>
            </Marker>
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

      {/* Lista de clínicas */}
      <View style={[styles.clinicsContainer, { backgroundColor }]}>
        <View style={styles.clinicsHeader}>
          <Text style={[styles.clinicsTitle, { color: '#2E8331' }]}>
            Clínicas Próximas
          </Text>
          <Text style={[styles.clinicsSubtitle, { color: textColor }]}>
            {clinics.length} encontradas
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
          {clinics.map((clinic) => (
            <TouchableOpacity
              key={clinic.id}
              style={[
                styles.clinicCard,
                selectedClinic?.id === clinic.id && styles.selectedClinicCard
              ]}
              onPress={() => handleMarkerPress(clinic)}
            >
              <View style={styles.clinicHeader}>
                <View style={styles.clinicInfo}>
                  <Text style={[styles.clinicName, { color: textColor }]}>
                    {clinic.name}
                  </Text>
                  <View style={styles.clinicTypeContainer}>
                    <Ionicons 
                      name={getMarkerIcon(clinic.type)} 
                      size={16} 
                      color={getMarkerColor(clinic.type)} 
                    />
                    <Text style={[styles.clinicType, { color: getMarkerColor(clinic.type) }]}>
                      {clinic.type}
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
                {clinic.address}
              </Text>
              
              <Text style={[styles.clinicDescription, { color: textColor }]}>
                {clinic.description}
              </Text>

              <View style={styles.clinicStatus}>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: clinic.openingHours === 'Aberto agora' ? '#4CAF50' : '#F44336' }
                ]} />
                <Text style={[styles.statusText, { color: textColor }]}>
                  {clinic.openingHours}
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
          ))}
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