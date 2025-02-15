import { Box, Typography } from '@mui/material';

export const OutputChart = ({ data }) => {
    
    return (
        <Box
            sx={{
                mt: 1
            }}>
            <Typography
                variant="body2"
                fontWeight="bold">
                    Chart:
            </Typography>

            <Box
                sx={{
                    height: 200,
                    bgcolor: 'grey.300',
                    borderRadius: 1
                }}>
                <Typography
                    align="center"
                        sx={{
                            lineHeight: '200px'
                        }}>
                    Chart Placeholder
                </Typography>
            </Box>
        </Box>
    );
}