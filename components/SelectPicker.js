import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';

const SelectPicker = ({ options, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        toggleModal();
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleModal}>
                <Text style={{ fontSize: 30, marginBottom: 10 }}>Language</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Text style={{ fontSize: 20 }}>{selectedOption || 'Select Your Language'}</Text>
                    <AntDesign name="caretdown" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide" // Set the animation type ('none', 'slide', or 'fade')
                transparent={true}
                isVisible={isVisible}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 200,
                    height: 500,
                    backgroundColor: "#F4E869"
                }}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => handleOptionSelect(option)}
                        >
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: "white" }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
};

export default SelectPicker;
