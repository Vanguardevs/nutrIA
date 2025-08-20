import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = { onAnimationFinish: () => void };

const { width } = Dimensions.get("window");

export default function AnimatedSplash({ onAnimationFinish }: Props): JSX.Element {
  const shimmerValue = useRef(new Animated.Value(0)).current as Animated.Value;
  const logoOpacity = useRef(new Animated.Value(0)).current as Animated.Value;
  const logoScale = useRef(new Animated.Value(0.8)).current as Animated.Value;
  const titleOpacity = useRef(new Animated.Value(0)).current as Animated.Value;
  const titleTranslateY = useRef(new Animated.Value(20)).current as Animated.Value;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const handleAnimationComplete = useCallback(() => {
    onAnimationFinish();
  }, [onAnimationFinish]);

  useEffect(() => {
    // Animação de entrada do logo
    const logoFadeIn = Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    });

    const logoScaleUp = Animated.spring(logoScale, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    });

    // Animação do título
    const titleFadeIn = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 600,
      useNativeDriver: true,
    });

    const titleSlideUp = Animated.timing(titleTranslateY, {
      toValue: 0,
      duration: 1000,
      delay: 600,
      useNativeDriver: true,
    });

    // Animação de brilho contínua
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    );

    // Executa todas as animações
    animationRef.current = Animated.parallel([
      logoFadeIn,
      logoScaleUp,
      titleFadeIn,
      titleSlideUp,
      shimmerAnimation,
    ]);

    animationRef.current.start();

    // Chama o callback após a animação principal terminar (aumentado para 3.5 segundos)
    const timer = setTimeout(() => {
      handleAnimationComplete();
    }, 3500);

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      clearTimeout(timer);
    };
  }, [logoOpacity, logoScale, titleOpacity, titleTranslateY, shimmerValue, handleAnimationComplete]);

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 140], // Exatamente o tamanho do círculo branco
  }) as Animated.AnimatedInterpolation<number>;

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.9, 0.9, 0],
  }) as Animated.AnimatedInterpolation<number>;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4CAF50", "#2E7D32", "#1B5E20"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Círculo branco de fundo */}
            <View style={styles.whiteCircle}>
              <Image source={require("@assets/icon.png")} style={styles.logo} resizeMode="contain" />

              {/* Efeito de brilho perfeitamente alinhado com o ícone */}
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{ translateX: shimmerTranslateX }],
                    opacity: shimmerOpacity,
                  },
                ]}
              >
                <LinearGradient
                  colors={["transparent", "rgba(255, 255, 255, 0.95)", "transparent"]}
                  style={styles.shimmerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>NutrIA</Text>
          <Text style={styles.subtitle}>Sua assistente nutricional</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden", // Contém o shimmer dentro do círculo
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 35, // Brilho fino e elegante
    height: "100%",
    borderRadius: 70, // Mesmo borderRadius do círculo branco
    alignSelf: "center",
  },
  shimmerGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 70, // Arredondado para combinar com o círculo
    transform: [{ skewX: "-12deg" }], // Inclinação sutil
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#E8F5E8",
    marginTop: 8,
    fontWeight: "300",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
