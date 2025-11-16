/**
 * Video Player Component
 *
 * Custom video player with controls
 */

import { useTheme } from '@/hooks';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ProgressBar } from './ProgressBar';

interface VideoPlayerProps {
  /**
   * Video URI
   */
  uri: string;

  /**
   * Auto play
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Loop
   * @default false
   */
  loop?: boolean;

  /**
   * Muted
   * @default false
   */
  muted?: boolean;

  /**
   * Resize mode
   * @default 'contain'
   */
  resizeMode?: ResizeMode;

  /**
   * Show controls
   * @default true
   */
  showControls?: boolean;
}

export function VideoPlayer({
  uri,
  autoPlay = false,
  loop = false,
  muted = false,
  resizeMode = ResizeMode.CONTAIN,
  showControls = true,
}: VideoPlayerProps) {
  const { colors } = useTheme();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);

  const controlsOpacity = useSharedValue(1);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleSeek = (value: number) => {
    const seekPosition = (value / 100) * duration;
    videoRef.current?.setPositionAsync(seekPosition);
  };

  const toggleControls = () => {
    const newValue = !showControlsOverlay;
    setShowControlsOverlay(newValue);
    controlsOpacity.value = withTiming(newValue ? 1 : 0, { duration: 200 });
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleControls} style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode={resizeMode}
          shouldPlay={autoPlay}
          isLooping={loop}
          isMuted={muted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {showControls && (
          <Animated.View
            style={[styles.controls, controlsStyle]}
            pointerEvents={showControlsOverlay ? 'auto' : 'none'}
          >
            {/* Center Play/Pause */}
            <Pressable onPress={togglePlayPause} style={styles.centerControl}>
              <View style={[styles.playButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
              </View>
            </Pressable>

            {/* Bottom Controls */}
            <View style={[styles.bottomControls, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <View style={styles.progressBar}>
                  <ProgressBar
                    progress={progress}
                    height={4}
                    color={colors.primary}
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControl: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
