"use client";
import React from "react";
import { Box, Card, Flex, Grid, Text, usePrefersDark } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
import { bgColorMap, colorMap } from "../utils/colorMap";

interface typeSelectorProps {
  value?: string;
  onChange: (event: PatchEvent) => void;
}

const types = [
  { title: "Internal", value: "internal", icon: "🔗" },
  { title: "External", value: "external", icon: "🌐" },
  { title: "Email address", value: "email", icon: "✉️" },
  { title: "Phone number", value: "phone", icon: "📞" },
];

const TypeSelector = ({ value, onChange }: typeSelectorProps) => {
  const themeType = usePrefersDark() ? "dark" : "light";

  const handleClick = (type: string) => {
    onChange(PatchEvent.from(set(type)));
  };

  return (
    <Grid columns={2} gap={3}>
      {types.map((type) => {
        const isSelected = value === type.value;
        const backgroundColor = isSelected
          ? bgColorMap[themeType].selected
          : bgColorMap[themeType].default;
        const color = isSelected
          ? colorMap[themeType].selected
          : colorMap[themeType].default;
        return (
          <Card
            key={type.value}
            padding={3}
            radius={2}
            shadow={1}
            style={{
              cursor: "pointer",
              backgroundColor: backgroundColor,
            }}
            onClick={() => handleClick(type.value)}
          >
            <Flex align="center">
              <Box marginRight={3}>{type.icon}</Box>
              <Text style={{ color: color }}>{type.title}</Text>
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};

export default TypeSelector;
