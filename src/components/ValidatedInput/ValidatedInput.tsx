
import React from 'react';
import { IonItem, IonLabel, IonInput, IonIcon, InputChangeEventDetail, IonText } from '@ionic/react'; // Importe IonText aqui

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
    // 'message' pode ser um erro específico para o campo em tempo real, se necessário.
    // No nosso caso, a mensagem global de erro do formulário já é suficiente.
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    value,
    onValueChange,
    icon,
    regex,
    isInvalid,
    type = 'text',
    inputmode,
    maxlength,
}) => {

    const handleInputChange = (e: CustomEvent<InputChangeEventDetail>) => {
        const inputValue = e.detail.value || '';

        // Permite a digitação, mas o isValid que vem do pai determinará o destaque visual no final.
        // Esta parte aqui só se preocupa em manter o input atualizado e não exceder maxlength.
        if (maxlength && inputValue.length > maxlength) {
            // Se exceder maxlength e um maxlength for definido, não atualiza o valor
            // e o isInvalid do pai se encarregará de mostrar o erro.
            return;
        }

        // Se o valor digitado não for um número (para type="tel", por exemplo), ou não corresponder à regex
        // e não for vazio, marca como inválido para feedback imediato na digitação.
        // No entanto, a validação final e a mensagem de erro específica virão do componente pai (GoodDeedsForm).
        const isValueCurrentlyValid = regex.test(inputValue) || inputValue === '';

        // Atualiza o valor. O estado 'isInvalid' é controlado pelo componente pai.
        onValueChange(inputValue);
    };

    return (
        <IonItem
            lines="full"
            className={isInvalid ? 'ion-invalid-border' : ''} // Aplica a classe para borda vermelha
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
                pattern={regex.source} // Importante para validação nativa do navegador
                type={type}
                inputmode={inputmode}
                maxlength={maxlength}
                style={{ '--padding-top': '20px' }} // Espaçamento entre label e input
            />
            {/* Mensagens de erro para este componente são gerenciadas pelo componente pai GoodDeedsForm */}
        </IonItem>
    );
};

export default ValidatedInput;