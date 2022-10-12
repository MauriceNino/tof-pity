import { Text, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons";
import { FC } from "react";

export const RemovableText: FC<{
  color: string;
  text: string;
  onRemove: () => void;
}> = ({ color, text, onRemove }) => {
  const { colors } = useMantineTheme();

  return (
    <Text
      sx={{
        color: color,
        [".icon"]: {
          width: 0,
          transition: "width .1s ease-in-out",
          cursor: "pointer",
        },
        ["&:hover"]: {
          [".icon"]: {
            width: 17,
          },
        },
      }}
      span
    >
      {text}

      <IconX
        size={17}
        style={{ verticalAlign: "middle", color: colors.red[4] }}
        onClick={onRemove}
      />
    </Text>
  );
};
