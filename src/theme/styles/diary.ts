import { StyleSheet } from "react-native";

// Using loose typing by default; consumers can extend as needed.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeBackground: {
    flex: 1,
    width: "100%",
  },
  fabTopContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  fabTop: {
    backgroundColor: "#2E8331",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 16,
    color: "#C7C7CC",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default styles;
