import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, useColorScheme, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const CustomPicker = ({ label, selectedValue, onValueChange, options }: CustomPickerProps) => {
  const colorScheme = useColorScheme();

  const background = colorScheme === "dark" ? "#1C1C1E" : "#fff";
  const texts = colorScheme === "dark" ? "#F2F2F2" : "#1C1C1E";
  const border = colorScheme === "dark" ? "#2E8331" : "#2E8331";

  return (
    <View style={styles.container1}>
      <View style={styles.container2}>
        <Text style={[styles.label, { color: texts }]}>{label}</Text>
        <View
          style={{
            borderWidth: 2,
            borderColor: border,
            borderRadius: 15,
            backgroundColor: background,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={onValueChange}
            items={options}
            value={selectedValue}
            placeholder={{ label: "Selecione uma opção...", value: null }}
            style={{
              ...pickerSelectStyles,
              inputIOS: {
                ...pickerSelectStyles.inputIOS,
                backgroundColor: background,
                color: texts,
              },
              inputAndroid: {
                ...pickerSelectStyles.inputAndroid,
                backgroundColor: background,
                color: texts,
              },
              inputWeb: {
                ...pickerSelectStyles.inputWeb,
                backgroundColor: background,
                color: texts,
              },
              placeholder: {
                color: colorScheme === "dark" ? "#888" : "#666",
              },
              iconContainer: { top: 12, right: 12 },
            }}
            Icon={() => (
              <Ionicons
                name="caret-down-outline"
                size={22}
                color={colorScheme === "dark" ? "#F2F2F2" : "#2E8331"}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container1: {
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 0,
    color: "#333",
    width: "100%",
    paddingRight: 35,
    textAlign: "center",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 0,
    color: "#333",
    width: "100%",
    paddingRight: 35,
    textAlign: "center",
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 0,
    color: "#333",
    width: "100%",
    paddingRight: 35,
    textAlign: "center",
  },
  placeholder: {
    color: "#999",
    textAlign: "center",
  },
});

export default CustomPicker;
