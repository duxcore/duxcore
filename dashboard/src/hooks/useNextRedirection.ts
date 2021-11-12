import { useRouter } from "next/router";
import { useWrapper } from "../context/WrapperProvider";

export function useNextRedirection() {
  let wrapper = useWrapper()
  let { replace } = useRouter()

  return (() => {
    let redirectPath = "/";

    try {
      const possibleIntendedPath = localStorage.getItem(wrapper.constants.INTENDED_PATH_KEY);

      if (possibleIntendedPath && possibleIntendedPath.startsWith("/")) {
        redirectPath = possibleIntendedPath;
        localStorage.setItem(wrapper.constants.INTENDED_PATH_KEY, "");
      }
    } catch { }

    console.log(redirectPath)
    replace(redirectPath);
  })
}
