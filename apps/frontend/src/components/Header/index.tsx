import React from 'react';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { FaGear } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Header = (): JSX.Element => {
  const naviagte = useNavigate();

  return (
    <Flex
      as="nav"
      display={'flex'}
      insetX="0"
      backgroundColor="gray.700"
      top={0}
      left={0}
      width="100vw"
      height="16"
      padding="3"
      alignItems="center"
      justifyContent="space-between"
    >
      <Heading size="md" color="white">
        Trace Data Quality Analyser
      </Heading>
      <IconButton
        aria-label="menu"
        variant="unstyled"
        color={'white'}
        icon={<FaGear />}
        onClick={() => {
          naviagte('/settings');
        }}
      />
    </Flex>
  );
};

export default Header;
