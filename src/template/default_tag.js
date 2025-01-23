import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
export const H3 = ({ title }) => (
    <Text style={styles.h3}>{title}</Text>
);
export const H1 = ({ title }) => (
    <Text style={styles.h1}>{title}</Text>
);
export const Badge = ({ }) => (
    <View style={styles.badge}></View>
);

const styles = StyleSheet.create({
    h1: {
        fontSize: 28,
        paddingVertical: 7.5,
        fontWeight: '600'
    },
    h3: {
        fontSize: 20,
        paddingVertical: 5
    },
    badge: {
        backgroundColor: 'red'
    }

});