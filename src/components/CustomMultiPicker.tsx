import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CustomMultiSelectProps {
  label: string;
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  options: { id: string; name: string }[];
  selectText?: string;
}

const CustomMultiSelect = ({
  label,
  selectedItems,
  onSelectedItemsChange,
  options,
  selectText = 'Selecione opções',
}: CustomMultiSelectProps) => {

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#F2F2F2' : '#1C1C1E';

  // Adapta as opções para o formato esperado pelo SectionedMultiSelect
  const sectionedOptions = [
    {
      name: label,
      id: 0,
      children: options,
    },
  ];


  return (
    <View style={styles.container1}>
      <View style={styles.container2}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>

          <SectionedMultiSelect
            items={sectionedOptions}
            uniqueKey="id"
            subKey="children"
            selectText={selectText}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            single={false} // multipla escolha, não unica
            showDropDowns={true} // pra aparecer as opções
            readOnlyHeadings={true} // da pra selecionar uma seção INTEIRA
            IconRenderer={Icon} // seta que aparece / icone
            confirmText="Confirmar" // texto do botão
            colors={{ primary: '#2E8331' }} // cor do botão
            hideSearch={true} //some com a pesquisa

            styles={{
              selectToggle: {
                backgroundColor,
                borderColor: '#2E8331',
                borderWidth: 2,
                borderRadius: 5,
                paddingHorizontal: 12,
                paddingVertical: 5,
                height: 40,
                marginBottom: 15,
                width: '100%',
              },
              selectToggleText: {
                color: textColor,
                fontSize: 16,
              },
              itemText: {
                color: textColor,
                fontSize: 26,
                paddingTop: 20,
                paddingLeft: 15,
              },
              selectedItemText: {
                color: '#2E8331',
              },
              selectedSubItemText: {
                color: '#2E8331',
              },


            
            }}
            searchPlaceholderText="Buscar..."
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    marginBottom: 15,
    width: '71%',
  },
  container2: {
  justifyContent: 'center',
  alignItems: 'center',
  
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CustomMultiSelect;
