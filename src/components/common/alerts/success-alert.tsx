import React from 'react';
import { Alert, AlertVariant } from './alert';

export const SuccessAlert = ({
    onClose,
    title = '¡Operación Exitosa!',
    message = 'Los datos se han guardado correctamente.',
}: {
    onClose: () => void;
    title?: string;
    message?: string;
}) => (
    <Alert variant={AlertVariant.SUCCESS} title={title} message={message} onClose={onClose} />
);
