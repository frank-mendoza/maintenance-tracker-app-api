import { useCallback, useState } from "react";

export function useModal(initialOpen = false) {
  const [isOpenModal, setIsOpenModal] = useState(initialOpen);

  const openModal = useCallback(() => setIsOpenModal(true), []);
  const closeModal = useCallback(() => setIsOpenModal(false), []);
  const toggleModal = useCallback(() => setIsOpenModal((prev) => !prev), []);

  return { isOpenModal, openModal, closeModal, toggleModal };
}
