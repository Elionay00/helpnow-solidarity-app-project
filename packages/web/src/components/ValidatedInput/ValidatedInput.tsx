import React from 'react';
import { IonItem, IonLabel, IonInput, IonIcon, InputChangeEventDetail, IonText } from '@ionic/react';

// Definindo as Props para o componente ValidatedInput
interface ValidatedInputProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    icon: string; // Ícones do Ionic são strings (SVG path)
    regex: RegExp;
    isInvalid: boolean;
    type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'url';
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
    maxlength?: number;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    value,
    onValueChange,
    icon,
    regex, // Note: regex is passed but its immediate validation isn't used for `isInvalid` state here.
    isInvalid,
    type = 'text',
    inputmode,
    maxlength,
}) => {

    const handleInputChange = (e: CustomEvent<InputChangeEventDetail>) => {
        const inputValue = e.detail.value || '';

        if (maxlength && inputValue.length > maxlength) {
            return;
        }

        // REMOVA OU COMENTE ESTA LINHA:
        // const isValueCurrentlyValid = regex.test(inputValue) || inputValue === ''; 

        // Atualiza o valor. O estado 'isInvalid' é controlado pelo componente pai.
        onValueChange(inputValue);
    };

    return (
        <IonItem
            lines="full"
            className={isInvalid ? 'ion-invalid-border' : ''}
            style={{ '--background': 'transparent', marginBottom: '10px' }}
        >
            <IonIcon icon={icon} slot="start" color={isInvalid ? "danger" : "primary"} />
            <IonLabel position="floating" color={isInvalid ? "danger" : undefined}>
                {label}
            </IonLabel>
            <IonInput
                value={value}
                onIonChange={handleInputChange}
                required
                pattern={regex.source}
                type={type}
                inputmode={inputmode}
                maxlength={maxlength}
                style={{ '--padding-top': '20px' }}
            />
        </IonItem>
    );
};

export default ValidatedInput;