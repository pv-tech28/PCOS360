import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';
import colors from '../../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SymptomAreaChart({ data, height = 150 }) {
  // Default data points: Oct, Nov, Dec (matching mockup screen 4)
  const chartData = data || [
    { label: 'Oct', value: 1.8 },
    { label: 'Nov', value: 3.5 },
    { label: 'Dec', value: 3.8 },
  ];

  const width = SCREEN_WIDTH - 64; // card padding (16*2) + screen padding (16*2)
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartAreaWidth = width - paddingLeft - paddingRight;
  const chartAreaHeight = height - paddingTop - paddingBottom;

  // Y-axis levels: High (5), Med (3), Low (1)
  const minY = 1;
  const maxY = 5;

  const getYCoord = (val) => {
    const normalized = (val - minY) / (maxY - minY);
    return paddingTop + chartAreaHeight * (1 - normalized);
  };

  const getXCoord = (index) => {
    if (chartData.length <= 1) return paddingLeft + chartAreaWidth / 2;
    return paddingLeft + (index / (chartData.length - 1)) * chartAreaWidth;
  };

  const points = chartData.map((d, i) => ({
    x: getXCoord(i),
    y: getYCoord(d.value),
    label: d.label,
    val: d.value,
  }));

  // Build smooth bezier curve
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const areaBottomY = paddingTop + chartAreaHeight;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${areaBottomY} L ${points[0].x} ${areaBottomY} Z`;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#7950A8" stopOpacity="0.35" />
            <Stop offset="80%" stopColor="#EDE5F7" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#FAF9FC" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Y Axis Guide Lines: High, Med, Low */}
        {[
          { label: 'High', val: 4.5 },
          { label: 'Med', val: 3 },
          { label: 'Low', val: 1.5 },
        ].map((guide, idx) => {
          const y = getYCoord(guide.val);
          return (
            <React.Fragment key={idx}>
              <SvgText
                x={8}
                y={y + 4}
                fontSize="11"
                fill={colors.textSecondary}
                fontWeight="500"
              >
                {guide.label}
              </SvgText>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#EFEAF4"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            </React.Fragment>
          );
        })}

        {/* Gradient Area Fill */}
        <Path d={areaPath} fill="url(#purpleGradient)" />

        {/* Smooth Purple Curve */}
        <Path
          d={linePath}
          fill="none"
          stroke="#7950A8"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Point Dots */}
        {points.map((pt, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="#FFFFFF"
              stroke="#7950A8"
              strokeWidth="2.5"
            />
            {/* X Axis Month Label */}
            <SvgText
              x={pt.x}
              y={height - 8}
              fontSize="11"
              fill={colors.textSecondary}
              textAnchor="middle"
              fontWeight="500"
            >
              {pt.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
});

