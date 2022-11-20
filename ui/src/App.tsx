import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [imageName,setImageName] = React.useState<string>("");
  
  const ddClient = useDockerDesktopClient();

  const handleClick = async () => {
    client.desktopUI.toast.success(`Started pulling image '${imageName}'`);
    
    try {
      await client.docker.cli.exec("pull", [imageName]);
      client.desktopUI.toast.success(`Image '${imageName}' pulled successfully`);
    } catch(e) {
      client.desktopUI.toast.error(e.stderr);
    }
  };

  return (
    <>
      <Typography variant="h3">Image Puller</Typography>
      <Stack direction="column" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        
        <TextField
          label="Image ID"
          sx={{ width: 320 }}
          variant="outlined"
          onChange={e => setImageName(e.target.value)}
        />
        
        <Button variant="contained" onClick={handleClick}>
          Pull Image
        </Button>
      </Stack>
    </>
  );
}
