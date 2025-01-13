import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { getWeatherForecast } from "../api";
import moment from "moment";

import 'moment/locale/ru' 
moment.locale("ru")

export default function WeatherScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const [city, setCity] = useState(null)
    const [list, setList] = useState([])

    useEffect(() => {
        navigation.setOptions({ title: 'Погода' })
        setCity(route.params.data)
        getForecast()
    }, [navigation, route])

    const getForecast = () => {
        getWeatherForecast(route.params.data.id).then(response => {
            setList(response.data.list)
        })
    }

    return <SafeAreaView style={styles.app}>
        <View style={{ alignSelf: 'center', marginTop: 16, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
                source={{ uri: 'https://openweathermap.org/img/w/' + route.params.data.weather[0].icon + '.png' }}
                style={styles.image}
            />
            <Text style={styles.cityName}>
                {route.params.data.city}
            </Text>
            <Text style={styles.temp}>
                {Math.round(route.params.data.main.temp)}°
            </Text>
            <Text style={styles.temp2}>
                {route.params.data.weather[0]?.description}
            </Text>
        </View>
        <FlatList
            data={list}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
                return <View style={styles.itemStyle}>
                    <Image
                        source={{ uri: 'https://openweathermap.org/img/w/' + item.weather[0].icon + '.png' }}
                        style={styles.img}
                    />
                    <Text style={styles.temp3}>
                        {Math.round(item.main.temp)}°
                    </Text>
                    <Text>
                        {moment(item.dt * 1000).format('ddd. h:mm a')}
                    </Text>
                </View>
            }}
            contentContainerStyle={styles.flatlistContainer}
            style={styles.flatlist}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: 'white'
    },
    cityName: {
        fontSize: 36,
        fontWeight: '600',
        textAlign: 'center'
    },
    temp: {
        fontSize: 64,
        fontWeight: '800',
        textAlign: 'center'
    },
    temp2: {
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center'
    },
    temp3: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center'
    },
    img: { 
        width: 32, 
        height: 32, 
        alignSelf: 'center' 
    },
    image: { 
        width: 100, 
        height: 100, 
        alignSelf: 'center' 
    },
    flatlist: { 
        flexGrow: 0, 
        height: 130, 
        marginBottom: 40 
    },
    flatlistContainer: { 
        gap: 16 
    },
    itemStyle: {
        padding: 10,
        backgroundColor: 'ghostwhite',
        borderRadius: 10,
        alignContent: 'center',
        justifyContent: 'center'
    }
})