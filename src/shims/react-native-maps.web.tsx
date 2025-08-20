// Simple web shim for react-native-maps to prevent native-only imports on web.
// Provides minimal no-op components to avoid crashes.
import React from "react";
import type { PropsWithChildren, CSSProperties } from "react";

export const Marker: React.FC = () => null;
export const PROVIDER_GOOGLE = "google" as const;

// Use permissive typing to avoid forcing consumers to depend on RN types in web.
interface MapViewProps {
  style?: CSSProperties;
}

const MapView: React.FC<PropsWithChildren<MapViewProps>> = ({ children, style }) => (
  <div style={{ ...(style || {}), backgroundColor: "#e5e5e5" }}>
    {/* Maps are disabled on web in this build. */}
    {children}
  </div>
);

export default MapView;
