import { TableRow, TableCell } from "@mui/material";
import { ToolRules } from "./ToolRules";

export const ToolItem = ({ tool }) => {

  if (!tool || !tool.id || !tool.name || !tool.description || !tool.rules) {
    return null;
  }

  return (
    <>
      <TableRow>
        <TableCell>{tool.name}</TableCell>
        <TableCell>{tool.description}</TableCell>
        <TableCell>
          <ToolRules content={tool.rules}/>
        </TableCell>
        <TableCell>
        {tool.toString()}
        </TableCell>
      </TableRow>
    </>
  );
};
