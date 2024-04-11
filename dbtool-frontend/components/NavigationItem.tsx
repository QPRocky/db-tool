import { Tooltip, Flex, Icon, Center } from '@chakra-ui/react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { IconType } from "react-icons";
import { NAV_ITEM_SIZE } from './Navigation';

interface Props {
  href: string;
  label: string;
  icon: IconType
}

const NavigationItem = ({ href, label, icon }: Props) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <Flex width={NAV_ITEM_SIZE} height={NAV_ITEM_SIZE} cursor="pointer">
        <Tooltip hasArrow label={label} placement="right" fontSize="xs" backgroundColor="gray.600" color="#fff">
          <Center flex={1}>
            <Icon
              as={icon}
              boxSize={5}
              color={router.asPath.includes(href) ? "gray.300" : "gray.500"}
            />
          </Center>
        </Tooltip>
      </Flex>
    </Link>
  );
};

export default NavigationItem;
