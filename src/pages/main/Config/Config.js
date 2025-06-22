import { SafeAreaView, View, Image, StyleSheet, useColorScheme, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {ref, onValue, getDatabase} from "firebase/database";
import { CommonActions, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton.js";
import { auth } from "../../../database/firebase";
import { signOut } from "firebase/auth";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

export default function Settings(){
    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    // Cores baseadas no tema
    const colors = {
        background: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F2',
        card: colorScheme === 'dark' ? '#2C2C2E' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1E',
        textSecondary: colorScheme === 'dark' ? '#8E8E93' : '#8E8E93',
        primary: '#2E8331',
        border: colorScheme === 'dark' ? '#38383A' : '#E5E5EA',
        error: '#FF3B30'
    };

    function loggout(){
        signOut(auth)
        .then(() => {
            // Logout successful
        }).catch((error) => {
            console.log(error);
        });
    }

    const ConfigItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
        <TouchableOpacity 
            style={[styles.configItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.configItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    {icon}
                </View>
                <View style={styles.configItemText}>
                    <Text style={[styles.configItemTitle, { color: colors.text }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.configItemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                    )}
                </View>
            </View>
            {showArrow && (
                <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.textSecondary} 
                />
            )}
        </TouchableOpacity>
    );

    return(
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar 
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={styles.headerContent}>
                    <Image 
                        source={require("../../../../assets/logoWelcome.png")} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Gerencie suas preferências e dados
                    </Text>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Seção de Perfil */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Perfil</Text>
                    <View style={[styles.sectionContainer, { backgroundColor: colors.card }]}>
                        <ConfigItem
                            icon={<MaterialCommunityIcons name="account-circle" size={24} color={colors.primary} />}
                            title="Dados Pessoais"
                            subtitle="Nome, email e informações básicas"
                            onPress={() => navigation.navigate("DataUser")}
                        />
                        <View style={[styles.separator, { backgroundColor: colors.border }]} />
                        <ConfigItem
                            icon={<FontAwesome5 name="heartbeat" size={20} color={colors.primary} />}
                            title="Dados de Saúde"
                            subtitle="Peso, altura e objetivos"
                            onPress={() => navigation.navigate("HealthData")}
                        />
                    </View>
                </View>

                {/* Seção de Conta */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Conta</Text>
                    <View style={[styles.sectionContainer, { backgroundColor: colors.card }]}>
                        <ConfigItem
                            icon={<Ionicons name="leaf" size={24} color={colors.primary} />}
                            title="Gerenciar Conta"
                            subtitle="Configurações da conta e privacidade"
                            onPress={() => navigation.navigate("AccountUser")}
                        />
                        <View style={[styles.separator, { backgroundColor: colors.border }]} />
                        <ConfigItem
                            icon={<Feather name="shield" size={24} color={colors.primary} />}
                            title="Privacidade e Segurança"
                            subtitle="Configurações de segurança"
                            onPress={() => {}}
                        />
                    </View>
                </View>

                {/* Seção de Aplicativo */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Aplicativo</Text>
                    <View style={[styles.sectionContainer, { backgroundColor: colors.card }]}>
                        <ConfigItem
                            icon={<Ionicons name="notifications" size={24} color={colors.primary} />}
                            title="Notificações"
                            subtitle="Configurar alertas e lembretes"
                            onPress={() => {}}
                        />
                        <View style={[styles.separator, { backgroundColor: colors.border }]} />
                        <ConfigItem
                            icon={<Ionicons name="help-circle" size={24} color={colors.primary} />}
                            title="Ajuda e Suporte"
                            subtitle="FAQ e contato"
                            onPress={() => {}}
                        />
                        <View style={[styles.separator, { backgroundColor: colors.border }]} />
                        <ConfigItem
                            icon={<Ionicons name="information-circle" size={24} color={colors.primary} />}
                            title="Sobre o App"
                            subtitle="Versão 1.0.0"
                            onPress={() => {}}
                            showArrow={false}
                        />
                    </View>
                </View>

                {/* Botão de Logout */}
                <View style={styles.logoutSection}>
                    <CustomButton 
                        title="Sair da Conta" 
                        onPress={loggout} 
                        variant="danger"
                        size="large"
                        style={styles.logoutButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 24,
        borderBottomWidth: 1,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        height: 60,
        width: 80,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    configItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    configItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    configItemText: {
        flex: 1,
    },
    configItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    configItemSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
    },
    separator: {
        height: 1,
        marginLeft: 80,
    },
    logoutSection: {
        marginTop: 40,
        paddingHorizontal: 24,
    },
    logoutButton: {
        width: '100%',
    },
});