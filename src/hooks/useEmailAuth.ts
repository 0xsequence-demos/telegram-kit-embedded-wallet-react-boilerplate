import { useEffect, useState } from "react";
import { Challenge } from "@0xsequence/waas";
import { useToast } from "@0xsequence/design-system";
import { sequence } from "../sequence";

const isAccountAlreadyLinkedError = (e: unknown) => {
  if (e && typeof e === "object" && "name" in e) {
    return e.name === "AccountAlreadyLinked";
  }
  return false;
};

export function useEmailAuth({
  onSuccess,
  sessionName,
  linkAccount = false,
}: {
  onSuccess: (res: { wallet: string; sessionId: string }) => void;
  sessionName: string;
  linkAccount?: boolean;
}) {
  const toast = useToast();

  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [respondWithCode, setRespondWithCode] = useState<
    ((code: string) => Promise<void>) | null
  >();

  const [challenge, setChallenge] = useState<Challenge | undefined>();

  useEffect(() => {
    return sequence.onEmailAuthCodeRequired(async (respondWithCode) => {
      setLoading(false);
      setRespondWithCode(() => respondWithCode);
    });
  }, [sequence, setLoading, setRespondWithCode]);

  const initiateAuth = async (email: string) => {
    setLoading(true);
    setInProgress(true);
    try {
      if (linkAccount) {
        const challenge = await sequence.initAuth({ email });
        setChallenge(challenge);
        setLoading(false);
      } else {
        const res = await sequence.signIn({ email }, sessionName);
        onSuccess(res);
      }
    } catch (e: unknown) {
      setError(JSON.stringify(e));
    } finally {
      if (!linkAccount) {
        setLoading(false);
        setInProgress(false);
      }
    }
  };

  const sendChallengeAnswer = async (answer: string) => {
    if (linkAccount && challenge) {
      //completeAuth(challenge.withAnswer(answer), { sessionName })
      try {
        await sequence.linkAccount(challenge.withAnswer(answer));
      } catch (e) {
        if (isAccountAlreadyLinkedError(e)) {
          toast({
            title: "Account already linked",
            description: "This account is already linked to another wallet",
            variant: "error",
          });
        } else {
          throw new Error("wtf");
        }
      }
      setLoading(false);
      setInProgress(false);
      return;
    }
    if (respondWithCode) {
      await respondWithCode(answer).catch((e) => {
        toast({
          title: "Code Incorrect",
          description: "The code you entered is not correct. Please try again.",
          variant: "error",
        });
        console.log(e);
      });
    }
  };

  const cancel = () => {
    setInProgress(false);
    setLoading(false);
    setChallenge(undefined);
    setRespondWithCode(null);
  };

  return {
    inProgress,
    initiateAuth,
    loading,
    error,
    sendChallengeAnswer: inProgress ? sendChallengeAnswer : undefined,
    cancel,
  };
}
