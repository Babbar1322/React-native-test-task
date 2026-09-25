import React from "react";
import { View, Text } from "react-native";
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Polygon,
  Rect,
} from "react-native-svg";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

type ChartDataPoint = {
  date: string;
  value: number;
};

type LineChartProps = {
  data1: ChartDataPoint[];
  data2: ChartDataPoint[];
  height?: number;
  width?: number;
  showTooltipAtIndex?: number;
};

export const LineChart: React.FC<LineChartProps> = ({
  data1,
  data2,
  height = 200,
  width = 350,
  showTooltipAtIndex,
}) => {
  const padding = 20;
  const allValues = [...data1, ...data2].map((d) => d.value);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  const stepX = (width - padding * 2) / (data1.length - 1);

  const getX = (index: number) => padding + index * stepX;
  const getY = (value: number) =>
    padding +
    ((maxValue - value) / (maxValue - minValue)) * (height - padding * 2);

  const buildPath = (data: ChartDataPoint[]) => {
    return data.reduce((path, point, i) => {
      const x = getX(i);
      const y = getY(point.value);
      return i === 0 ? `M ${x},${y}` : `${path} L ${x},${y}`;
    }, "");
  };

  return (
    <View
      style={{
        // paddingVertical: 10,
        overflow: "hidden",
        // backgroundColor: "red",
        gap: verticalScale(5),
      }}
    >
      <Svg height={height} width={width}>
        {/* Line 1 (Purple) */}
        <Path
          d={buildPath(data1)}
          stroke="#C084FC"
          strokeWidth={2}
          fill="none"
        />

        {/* Line 2 (White) */}
        <Path
          d={buildPath(data2)}
          stroke="#FFFFFF"
          strokeWidth={2}
          fill="none"
        />

        {/* Dots for Line 1 */}
        {data1.map((point, i) => (
          <Circle
            key={`dot1-${i}`}
            cx={getX(i)}
            cy={getY(point.value)}
            r={4}
            fill="#C084FC"
          />
        ))}

        {/* Dots for Line 2 */}
        {data2.map((point, i) => (
          <Circle
            key={`dot2-${i}`}
            cx={getX(i)}
            cy={getY(point.value)}
            r={4}
            fill="#FFFFFF"
          />
        ))}

        {/* Tooltip */}
        {typeof showTooltipAtIndex === "number" &&
          data1[showTooltipAtIndex] &&
          (() => {
            const tooltipX = getX(showTooltipAtIndex);
            const tooltipY = getY(data1[showTooltipAtIndex].value);
            const bubbleWidth = 60;
            const bubbleHeight = 28;
            const triangleHeight = 8;
            const triangleWidth = 12;
            const valueText = data1[showTooltipAtIndex].value.toLocaleString();

            return (
              <>
                {/* Tooltip bubble */}
                <Svg>
                  {/* Bubble (rounded rect) */}
                  <Rect
                    x={tooltipX - bubbleWidth / 2}
                    y={tooltipY - bubbleHeight - triangleHeight - 4}
                    width={bubbleWidth}
                    height={bubbleHeight}
                    rx={8}
                    ry={8}
                    fill="#265d63"
                  />

                  {/* Triangle */}
                  <Polygon
                    points={`
              ${tooltipX - triangleWidth / 2},${tooltipY - triangleHeight - 4}
              ${tooltipX + triangleWidth / 2},${tooltipY - triangleHeight - 4}
              ${tooltipX},${tooltipY - 4}
            `}
                    fill="#265d63"
                  />

                  {/* Text */}
                  <SvgText
                    x={tooltipX}
                    y={tooltipY - bubbleHeight - triangleHeight + 14}
                    fontSize="14"
                    fontWeight="bold"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {valueText}
                  </SvgText>
                </Svg>
              </>
            );
          })()}
      </Svg>

      {/* X-Axis Labels */}
      <View
        style={{
          flexDirection: "row",
          gap: horizontalScale(15),

          //   paddingHorizontal: padding,
        }}
      >
        {data1.map((d, i) => (
          <CustomText
            key={`label-${i}`}
            color={COLORS.greyMedium}
            fontSize={12}
          >
            {d.date}
          </CustomText>
        ))}
      </View>
    </View>
  );
};
