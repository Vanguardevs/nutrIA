import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

type Props = { children?: React.ReactNode };
type State = { error: Error | null; errorInfo: React.ErrorInfo | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    const { error, errorInfo } = this.state;
    if (error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.message}>{String(error && error.message)}</Text>
          {!!errorInfo && (
            <View style={styles.box}>
              <Text style={styles.subtitle}>Stack</Text>
              <Text selectable style={styles.code}>
                {errorInfo.componentStack || ""}
              </Text>
            </View>
          )}
          <Text style={styles.hint}>Veja o console do navegador para mais detalhes.</Text>
        </ScrollView>
      );
    }
    return this.props.children as React.ReactElement | null;
  }
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, alignItems: "stretch", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  message: { fontSize: 14, color: "#b00020", marginBottom: 12, textAlign: "center" },
  box: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 6 },
  subtitle: { fontWeight: "600", marginBottom: 6 },
  code: { fontFamily: "monospace" },
  hint: { marginTop: 12, textAlign: "center", color: "#555" },
});
