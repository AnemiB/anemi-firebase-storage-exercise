import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const AddScreen = () => {

  const [title, setTitle] = useState('')

  return (
    <View style={styles.container}>
        <TextInput
            style={styles.inputField}
            placeholder="Memory Title"
            onChangeText={newText => setTitle(newText)}
            defaultValue={title}
        />

        {/* TODO: Upload Image */}

        <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}>Add Memory</Text>
        </TouchableOpacity> 
    </View>
  )
}

export default AddScreen

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    inputField: {
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 15,
        padding: 10
    },
    button: {
        backgroundColor: "green",
        textAlign: 'center',
        padding: 15,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
})