import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import colors from '../../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PhenotypeRadarChart({
  metrics = {
    androgenExcess: 85,
    ovulatoryIrregularity: 80,
    metabolicSensitivity: 75,
    follicularDensity: 40,
    symptomVariability: 65,
  },
  size = SCREEN_WIDTH - 80,
}) {
  const center = size / 2;
  const radius = center - 38;

  const axes = [
    { key: 'androgenExcess', label: 'Androgens' },
    { key: 'ovulatoryIrregularity', label: 'Ovulation' },
    { key: 'metabolicSensitivity', label: 'Metabolism' },
    { key: 'follicularDensity', label: 'Follicles' },
    { key: 'symptomVariability', label: 'Symptoms' },
  ];

  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Concentric polygon grid levels
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (valueNormalized, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueNormalized;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build data polygon points string
  const polygonPoints = axes
    .map((axis, i) => {
      const val = (metrics[axis.key] || 50) / 100;
      const { x, y } = getCoordinates(val, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Grid Rings */}
        {levels.map((lvl, lIdx) => {
          const ringPoints = axes
            .map((_, i) => {
              const { x, y } = getCoordinates(lvl, i);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <Polygon
              key={lIdx}
              points={ringPoints}
              fill={lIdx === levels.length - 1 ? '#FAF5FF' : 'none'}
              stroke="#E9D8FD"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes from center */}
        {axes.map((axis, i) => {
          const outer = getCoordinates(1.0, i);
          const labelCoord = getCoordinates(1.22, i);
          return (
            <React.Fragment key={i}>
              <Line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#E2D9EC"
                strokeWidth="1"
              />
              <SvgText
                x={labelCoord.x}
                y={labelCoord.y + 4}
                fontSize="10.5"
                fill={colors.textSecondary}
                fontWeight="600"
                textAnchor="middle"
              >
                {axis.label}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Data Shape */}
        <Polygon
          points={polygonPoints}
          fill="rgba(121, 80, 168, 0.35)"
          stroke="#7950A8"
          strokeWidth="2.5"
        />

        {/* Vertex Dots */}
        {axes.map((axis, i) => {
          const val = (metrics[axis.key] || 50) / 100;
          const { x, y } = getCoordinates(val, i);
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill="#FFFFFF"
              stroke="#7950A8"
              strokeWidth="2"
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

