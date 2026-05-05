import { useTheme } from "@/contexts/ThemeContext";
import { Image, Modal, Pressable, Text, View, useWindowDimensions } from "react-native";

type MediaViewerProps = {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
};

export default function MediaViewer({ visible, imageUri, onClose }: MediaViewerProps) {
  const { fonts } = useTheme();
  const { width, height } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: imageUri }}
          style={{ width, height: height * 0.78 }}
          resizeMode="contain"
        />
        <Pressable
          onPress={onClose}
          style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 24, paddingHorizontal: 24, paddingVertical: 10, marginTop: 20 }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontFamily: fonts.sans.medium }}>Close Image</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
