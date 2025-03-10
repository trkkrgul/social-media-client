import { Suspense, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { Card, CardBody, CardFooter, CardHeader } from "@saas-ui/react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { IoCloseCircle, IoCloseCircleOutline } from "react-icons/io5";
import Image from "next/image";
import imageLoader from "@/assets/image-loader.gif";
import { imageLoaderGifBase64 } from "../imageLoaderBase64";
const ImageGallery = ({ images }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const { colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openPreview = (index) => {
    setPreviewIndex(index);
    // setIsPreviewOpen(true);

    onOpen();
  };

  const closePreview = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to the parent element
    // setIsPreviewOpen(false);
    onClose();
  };

  const downloadImage = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to the parent element
    window.open(images[previewIndex], "_blank");
  };

  const handleMouseDown = (event) => {
    setDragStartX(event.clientX);
  };

  const handleMouseUp = (event) => {
    const dragEndX = event.clientX;
    const dragDistance = dragStartX - dragEndX;

    if (dragDistance > 50 && previewIndex < images.length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (dragDistance < -50 && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }

    setDragStartX(null);
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Flex
          width={"100%"}
          alignItems={"center"}
          flexWrap={"wrap"}
          bg={colorMode === "dark" ? "blackAlpha.100" : "whiteAlpha.100"}
          overflow={"hidden"}
          my={2}
          borderRadius={"xl"}
          border="1px"
          borderColor={
            colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"
          }
        >
          {images.map((src, index) => (
            <Image
              placeholder={"blur"}
              blurDataURL={`${imageLoaderGifBase64}`}
              onClick={() => openPreview(index)}
              src={src}
              width={700}
              height={700}
              alt="Post Image"
              style={{
                objectFit: "cover",
                aspectRatio: `${images.length < 3 ? 1 : 2} / 1`,
                width:
                  images.length === 1
                    ? "100%"
                    : images.length === 2
                    ? "50%"
                    : images.length === 3
                    ? index > 0
                      ? "50%"
                      : "100%"
                    : "50%",
              }}
            />
          ))}{" "}
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent>
            <Box
              backdropFilter={"auto"}
              backdropBlur={"sm"}
              onClick={closePreview}
              position={"fixed"}
              zIndex={"overlay"}
              top={"0"}
              left={"0"}
              width={"100vw"}
              height={"100vh"}
              backgroundColor={" rgba(0, 0, 0, 0.7)"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Card
                onClick={(event) => event.stopPropagation()}
                bg={colorMode === "dark" ? "gray.800" : "whiteAlpha.800"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                w={["90%", "90%", "900px"]}
                className="essek"
              >
                <CardHeader>
                  <HStack w={"100%"}>
                    <Spacer />
                    <IconButton
                      variant={"ghost"}
                      size={"lg"}
                      icon={<IoCloseCircleOutline size={"24"} />}
                      onClick={closePreview}
                    />
                  </HStack>
                </CardHeader>
                <CardBody>
                  <HStack justifyContent={"space-between"}>
                    <Icon
                      fontSize={"24"}
                      as={BsArrowLeftCircle}
                      cursor={previewIndex === 0 ? "not-allowed" : "pointer"}
                      onClick={() => {
                        if (previewIndex === 0) {
                          return;
                        }
                        setPreviewIndex((prev) => prev - 1);
                      }}
                    />

                    {!!(images.length > 0) && (
                      <Image
                        src={images[previewIndex]}
                        width={640} // ['79%', '79%', '640px']
                        height={450}
                        alt={`Image ${previewIndex + 1}`}
                        style={{
                          objectFit: "contain",
                          borderRadius: 10,
                          maxHeight: "450px",
                          maxWidth: "80%",
                        }}
                      />
                    )}
                    <Icon
                      fontSize={"24"}
                      as={BsArrowRightCircle}
                      cursor={
                        previewIndex === images.length - 1
                          ? "not-allowed"
                          : "pointer"
                      }
                      onClick={() => {
                        if (previewIndex === images.length - 1) {
                          return;
                        }
                        setPreviewIndex((prev) => prev + 1);
                      }}
                    />
                  </HStack>
                </CardBody>
                <CardFooter>
                  <Flex
                    justifyContent={"center"}
                    width={"100%"}
                    gap={"2"}
                    alignItems={"center"}
                  >
                    {images.map((src, index) => (
                      <Box key={index} onClick={() => setPreviewIndex(index)}>
                        <Image
                          width={index === previewIndex ? 100 : 50}
                          height={index === previewIndex ? 50 : 50}
                          style={{
                            borderRadius: "10px",
                            objectFit: "cover",
                            width: index === previewIndex ? 100 : 50,
                            height: index === previewIndex ? 50 : 50,
                          }}
                          src={src}
                          alt={`Image ${index + 1}`}
                        />
                      </Box>
                    ))}
                  </Flex>
                </CardFooter>
              </Card>
            </Box>
          </ModalContent>
        </Modal>
      </div>
    </Suspense>
  );
};

export default ImageGallery;
