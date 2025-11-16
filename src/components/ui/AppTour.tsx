/**
 * App Tour Component
 *
 * Spotlight-style guided tutorial with step-by-step tooltips
 */

import { useTheme } from '@/hooks';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutRectangle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Button } from './Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TourStep {
  /**
   * Target element layout (measure the target view)
   */
  target: LayoutRectangle;

  /**
   * Step title
   */
  title: string;

  /**
   * Step description
   */
  description: string;

  /**
   * Tooltip position
   */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface AppTourProps {
  /**
   * Tour steps
   */
  steps: TourStep[];

  /**
   * Visible
   */
  visible: boolean;

  /**
   * On complete callback
   */
  onComplete: () => void;

  /**
   * On skip callback
   */
  onSkip?: () => void;
}

export function AppTour({ steps, visible, onComplete, onSkip }: AppTourProps) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  if (!visible || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View style={[styles.overlay, overlayStyle]}>
        {/* Spotlight cutout */}
        <View style={StyleSheet.absoluteFill}>
          {/* Top */}
          <View
            style={[
              styles.overlaySection,
              {
                height: step.target.y,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            ]}
          />

          {/* Middle row */}
          <View style={{ flexDirection: 'row', height: step.target.height }}>
            {/* Left */}
            <View
              style={[
                styles.overlaySection,
                {
                  width: step.target.x,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              ]}
            />

            {/* Spotlight */}
            <View
              style={{
                width: step.target.width,
                height: step.target.height,
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 8,
              }}
            />

            {/* Right */}
            <View
              style={[
                styles.overlaySection,
                {
                  flex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              ]}
            />
          </View>

          {/* Bottom */}
          <View
            style={[
              styles.overlaySection,
              {
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            ]}
          />
        </View>

        {/* Tooltip */}
        <View
          style={[
            styles.tooltip,
            getTooltipPosition(step.target, step.tooltipPosition),
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.tooltipHeader}>
            <Text style={[styles.tooltipTitle, { color: colors.text }]}>
              {step.title}
            </Text>
            <Text style={[styles.stepIndicator, { color: colors.textSecondary }]}>
              {currentStep + 1} / {steps.length}
            </Text>
          </View>

          <Text style={[styles.tooltipDescription, { color: colors.textSecondary }]}>
            {step.description}
          </Text>

          <View style={styles.tooltipActions}>
            {!isLastStep && onSkip && (
              <View style={styles.buttonHalf}>
                <Button variant="outline" onPress={handleSkip}>
                  Skip
                </Button>
              </View>
            )}
            <View style={styles.buttonHalf}>
              <Button variant="primary" onPress={handleNext}>
                {isLastStep ? 'Got it!' : 'Next'}
              </Button>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

function getTooltipPosition(
  target: LayoutRectangle,
  position: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
) {
  const offset = 16;

  switch (position) {
    case 'top':
      return {
        bottom: SCREEN_HEIGHT - target.y + offset,
        left: offset,
        right: offset,
      };
    case 'left':
      return {
        top: target.y,
        right: SCREEN_WIDTH - target.x + offset,
        left: offset,
      };
    case 'right':
      return {
        top: target.y,
        left: target.x + target.width + offset,
        right: offset,
      };
    case 'bottom':
    default:
      return {
        top: target.y + target.height + offset,
        left: offset,
        right: offset,
      };
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlaySection: {
    width: '100%',
  },
  tooltip: {
    position: 'absolute',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 14,
  },
  tooltipDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tooltipActions: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
});
