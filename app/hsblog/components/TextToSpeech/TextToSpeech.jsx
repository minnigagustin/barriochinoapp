import React, { useState } from 'react';
import { View, Button, useMount, Icons, Text, withViewStyles, useTheme } from "../../shared";
import * as Speech from 'expo-speech';
import { TouchableOpacity as RNTouchableOpacity, ActivityIndicator } from 'react-native';
import i18n from "../../utils/functions/i18n";
import isIOS from "../../shared/utils/isIOS";
import { Debug } from "../../utils/functions/Debug";
import styles from './styles';
const TouchableOpacity = withViewStyles(RNTouchableOpacity);
const TextToSpeech = ({ lang = 'en-US', text }) => {
    const { colors } = useTheme();
    const [inProgress, setInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pause, setPause] = useState(true);
    const [voice, setVoice] = useState({
        language: 'en-US',
        quality: Speech.VoiceQuality.Default,
        name: 'Aaron',
        identifier: 'com.apple.ttsbundle.siri_male_en-US_compact',
    });
    const getVoices = async () => {
        const voices = await Speech.getAvailableVoicesAsync();
        const [voice] = voices.filter(item => item.language === lang);
        setVoice(voice);
    };
    useMount(() => {
        getVoices();
    });
    const handleStart = () => {
        setInProgress(true);
        setLoading(false);
    };
    const handleDone = () => {
        setInProgress(false);
        setPause(true);
        setLoading(false);
    };
    const speak = () => {
        Debug(() => {
            setLoading(true);
            Speech.speak(text, {
                language: lang,
                voice: voice.identifier,
                pitch: 1,
                rate: 0.75,
                onStart: handleStart,
                onDone: handleDone,
                onStopped: handleDone,
                onError: handleDone,
            });
        });
    };
    const handlePause = () => {
        Speech.pause();
        setPause(false);
    };
    const handleResume = () => {
        Speech.resume();
        setPause(true);
    };
    const handleStop = () => {
        Speech.stop();
    };
    const pauseElement = (<TouchableOpacity onPress={handlePause} backgroundColor="dark2" style={[styles.button]}>
      <Icons.MaterialIcons name="pause" size={30} color="secondary"/>
    </TouchableOpacity>);
    const playElement = (<TouchableOpacity onPress={handleResume} backgroundColor="dark2" style={[styles.button]}>
      <Icons.MaterialIcons name="play-arrow" size={30} color="secondary"/>
    </TouchableOpacity>);
    if (inProgress) {
        return (<View tachyons={['flexRow', 'itemsCenter']}>
        {pause ? (isIOS ? pauseElement : null) : playElement}
        <TouchableOpacity onPress={handleStop} backgroundColor="dark2" tachyons="ml1" style={[styles.button]}>
          <Icons.MaterialIcons name="stop" size={30} color="tertiary"/>
        </TouchableOpacity>
      </View>);
    }
    return (<Button onPress={speak} borderRadius="pill" size="small" backgroundColor="dark1" style={styles.buttonText}>
      {loading ? <ActivityIndicator size="small" color={colors.light}/> : <Icons.Feather name="play" color="gray2" size={24}/>}
      <Text color="gray2" tachyons="ml1">
        {i18n.t('speech')}
      </Text>
    </Button>);
};
export default TextToSpeech;
