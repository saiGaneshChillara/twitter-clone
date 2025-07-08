import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoading, handleAuth } = useAuth();
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth1.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>

          {/* Container for the buttons */}
          <View className="flex-col gap-2 mt-2">
            {/* Google signup button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleAuth("oauth_google")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              { isLoading ? (
                <ActivityIndicator size={"small"} color={"#4285f4"} />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/google.png")}
                    className="size-10 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Apple signup button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleAuth("oauth_apple")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              { isLoading ? (
                <ActivityIndicator size={"small"} color={"#000"} />
                
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/apple.png")}
                    className="size-8 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Apple
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Terms and conditions */}
          <Text className="text-center text-gray-500 text-xs leading-4 mt-3 px-2">
            By singingup, you agree to our <Text className="text-blue-500">Terms</Text>{", "} <Text className="text-blue-500">Privacy Policy</Text>{", and "}
            <Text className="text-blue-500">Cookies Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
