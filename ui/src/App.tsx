// This extension was originally modified from
// https://github.com/tunc1/docker-pull-ui, which was very helpful during
// development. But that repo doesn't appear to exist anymore.

import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [uiEnabled,setUIEnabled] = React.useState<boolean>(true);
  const [imageName,setImageName] = React.useState<string>("");
  
  const ddClient = useDockerDesktopClient();

  const handleClick = async () => {
    setUIEnabled(false);
    client.desktopUI.toast.success(`Started pulling image '${imageName}'`);
    
    try {
      await client.docker.cli.exec("pull", [imageName]);
      client.desktopUI.toast.success(`Image '${imageName}' pulled successfully`);
    } catch(e) {
      client.desktopUI.toast.error(e.stderr);
    }
    
    setUIEnabled(true);
  };

  return (
    <>
      <Typography variant="h3">Image Puller</Typography>
      <Stack direction="column" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        
        <TextField
          disabled={!uiEnabled}
          label="Image ID"
          sx={{ width: 320 }}
          variant="outlined"
          onChange={e => setImageName(e.target.value)}
        />
        
        <Button disabled={!uiEnabled} variant="contained" onClick={handleClick}>
          Pull Image
        </Button>
      </Stack>
    </>
  );
}
