/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

export const useAuth = () => {
  const [isLoading, setIsloading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setIsloading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (err: any) {
      console.log("Error in auth hook:", err);
      const provider = strategy === "oauth_apple" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${provider}`);
    } finally {
      setIsloading(false);
    }
  };

  return { isLoading, handleAuth };
};