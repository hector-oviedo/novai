import { ListItemIcon, ListItemText, MenuItem, MenuList, useTheme } from "@mui/material";
import { FaComments, FaFileAlt, FaCogs } from "react-icons/fa";

export const PageNav = ({ setActivePage }) => {
    const theme = useTheme();

    return (
        <MenuList sx={{
            backgroundColor: theme.palette.nav.background,
            color: theme.palette.text.primary,
            p:'0'
        }}>
            <MenuItem onClick={() => setActivePage("sessions")}>
                <ListItemIcon>
                    <FaComments size={24} />
                </ListItemIcon>
                <ListItemText>Sessions</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setActivePage("documents")}>
                <ListItemIcon>
                    <FaFileAlt size={24} />
                </ListItemIcon>
                <ListItemText>Documents</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setActivePage("tools")}>
                <ListItemIcon>
                    <FaCogs size={24} />
                </ListItemIcon>
                <ListItemText>Functions</ListItemText>
            </MenuItem>
        </MenuList>
    );
};
