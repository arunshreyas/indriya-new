import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface CardProps {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function Card({ children, title, subtitle, onPress, style }: CardProps) {
    const content = (
        <>
            {(title || subtitle) && (
                <View style={styles.header}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            )}
            {children}
        </>
    );

    if (onPress) {
        return (
            <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{content}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surfaceDark,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: Typography.serif.join(','),
        marginBottom: 4,
    },
    subtitle: {
        color: Colors.textMuted,
        fontSize: 14,
        fontFamily: Typography.display.join(','),
    },
});
