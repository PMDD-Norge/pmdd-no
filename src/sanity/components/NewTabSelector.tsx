"use client";
import React from "react";
import { Card, Flex, Grid, Text, Stack, Box, usePrefersDark } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
import { bgColorMap, colorMap } from "../utils/colorMap";

interface NewTabSelectorProps {
  value?: boolean;
  onChange: (event: PatchEvent) => void;
}

const NewTabSelector: React.FC<NewTabSelectorProps> = ({
  value = false,
  onChange,
}) => {
  const themeType = usePrefersDark() ? "dark" : "light";

  const handleClick = (newValue: boolean) => {
    onChange(PatchEvent.from(set(newValue)));
  };

  const getCardStyles = (isSelected: boolean) => ({
    cursor: "pointer",
    backgroundColor: isSelected
      ? bgColorMap[themeType].selected
      : bgColorMap[themeType].default,
    color: isSelected
      ? colorMap[themeType].selected
      : colorMap[themeType].default,
  });

  return (
    <Stack space={3}>
      <Text size={1} weight="medium">
        Should this link open in a new tab?
      </Text>
      <Text size={1} muted>
        Enable this option to open the link in a new browser tab. This can be
        useful for keeping the current page open.
      </Text>
      <Grid columns={2} gap={3}>
        <Card
          padding={3}
          radius={2}
          shadow={1}
          style={getCardStyles(value === true)}
          onClick={() => handleClick(true)}
        >
          <Flex align="center">
            <Box marginRight={3}>✅</Box>
            <Text>Yes</Text>
          </Flex>
        </Card>
        <Card
          padding={3}
          radius={2}
          shadow={1}
          style={getCardStyles(value === false)}
          onClick={() => handleClick(false)}
        >
          <Flex align="center">
            <Box marginRight={3}>❌</Box>
            <Text>No</Text>
          </Flex>
        </Card>
      </Grid>
    </Stack>
  );
};

export default NewTabSelector;
