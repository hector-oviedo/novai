import { InputWidget } from "./input/InputWidget";
import { OutputWidget } from "./output/OutputWidget";
import { Box } from "@mui/material";

export const ChatPage = () => {
    return (
        <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <OutputWidget />
        <InputWidget />
      </Box>
    )
}