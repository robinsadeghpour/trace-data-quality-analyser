import React, { useState } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Input,
  Tooltip,
  IconButton,
  HStack,
  VStack,
  Button,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  useAddUserMail,
  useDeleteUserMail,
  useUserMails,
} from '../services/settings.service';
import { UserEmail, RequestBody } from '@tdqa/types';
import { useNavigate } from 'react-router-dom';

const Settings = (): JSX.Element => {
  const { mutate: deleteUserMail } = useDeleteUserMail();
  const { mutate: addUserMail } = useAddUserMail();
  const { data: userMails } = useUserMails();
  const [newMail, setNewMail] = useState('');
  const navigate = useNavigate();

  const handleAddMail = (): void => {
    addUserMail({ email: newMail } as RequestBody<UserEmail>);
    setNewMail('');
  };

  return (
    <Box width={'80%'} height="full">
      <Heading size={'xl'}>Settings</Heading>
      <Button onClick={() => navigate('/')} top="4">
        Back
      </Button>
      <VStack mt={8} alignItems={'start'} width={'60%'}>
        <HStack alignItems={'center'} mt={4}>
          <Heading size={'sm'} display="inline-block" mr={2}>
            UserMails
          </Heading>
          <Tooltip label="These registered user emails are notified when metrics reach a certain threashhold">
            <QuestionOutlineIcon />
          </Tooltip>
        </HStack>
        <List spacing={3} mt={2}>
          {userMails &&
            userMails.map((mail) => (
              <ListItem key={mail.email}>
                <HStack spacing={2}>
                  <Input value={mail.email} disabled={true} />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme={'red'}
                    aria-label="Delete Mail"
                    onClick={() => deleteUserMail(mail._id.toString())}
                  />
                </HStack>
              </ListItem>
            ))}
        </List>
        <HStack justifyContent={'center'} mt={4} spacing={2}>
          <Input
            placeholder="Add new email"
            value={newMail}
            onChange={(e) => setNewMail(e.target.value)}
          />
          <IconButton
            icon={<AddIcon />}
            onClick={handleAddMail}
            size="sm"
            colorScheme={'green'}
            aria-label={'Add Mail'}
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default Settings;
