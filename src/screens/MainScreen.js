import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, Image } from 'react-native';
import { getWeatherCity, searchCity } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/weatherSlice";

export default function MainScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data } = useSelector(state => state.weather)
    console.log(data)

    const [text, setText] = useState('')
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        navigation.setOptions({ title: 'Погода' })

        if( data && data.length > 0){
            setList(data)
        }
    }, [navigation])

    const onSearch = () => {
        if (text.length < 3) {
            return
        }
        searchCity(text).then(response => {
            if (response.status == 200) {
                let data = {
                    lon: response.data[0].lon,
                    lat: response.data[0].lat
                }
                
                getWeatherCity(data).then(res => {
                    console.log(res.data)
                    let curr = { 
                        ...res.data, 
                        city: response.data[0].local_names.ru || response.data[0].name,
                        timestamp: new Date()
                    }
                    setCurrent(curr)
                    setList([ ...list, curr ])
                    dispatch(setData([ ...list, curr ]))
                }).catch(error=> console.log(error))
            }
        }).finally(()=> Keyboard.dismiss() )
    }

    const goNavigate = (data) => navigation.navigate('WeatherScreen', { data: data })

    return <SafeAreaView style={styles.app}>
        <View style={styles.searchHead}>
            <TextInput
                value={text}
                onChangeText={setText}
                keyboardType='web-search'
                placeholder='Напишите название города'
                style={{ flexGrow: 1 }}
            />
            <TouchableOpacity onPress={onSearch} style={styles.searchBtn}>
                <MaterialIcons name='search' size={24} color={'white'} />
            </TouchableOpacity>
        </View>
        <View>
            { current && <TouchableOpacity style={{ margin: 16 }} onPress={()=> goNavigate(current) }>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                        source={{ uri: 'https://openweathermap.org/img/w/' + current.weather[0].icon + '.png' }} 
                        style={{ width: 32, height: 32, marginRight: 8 }} 
                    />
                    <Text style={styles.cityName}>{current.city}</Text>
                </View>

                <Text>Температура: {Math.round(current.main.temp)}°</Text>
                <Text>Влажность: {current.main.humidity}</Text>
                <Text>{current.weather[0].description}</Text>

            </TouchableOpacity>}
        </View>
        <FlatList 
            data={list}
            ListHeaderComponent={
                <View style={{ alignSelf: 'center' }}>
                    { list.length > 0 && <Text>История поиска</Text>}
                </View>
            }
            bounces={false}
            renderItem={({item, index})=>{
                return <TouchableOpacity key={item?.timestamp} onPress={()=> goNavigate(item) } style={styles.itemStyle}>
                    <Text style={styles.cityName}>{item?.city}</Text>
                    <Text>Температура: {Math.round(item?.main?.temp)}°</Text>
                </TouchableOpacity>
            }}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchHead: {
        borderWidth: 1,
        margin: 16,
        paddingVertical: 4,
        paddingLeft: 16,
        paddingRight: 8,
        borderRadius: 12,
        borderColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    searchBtn: {
        backgroundColor: 'black',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8
    },
    cityName: {
        fontSize: 16,
        fontWeight: '700'
    },
    itemStyle: { 
        marginHorizontal: 16,
        marginVertical: 8,
        borderBottomWidth: 1,
        paddingBottom: 8,
        borderBlockColor: 'gray'
    }
})