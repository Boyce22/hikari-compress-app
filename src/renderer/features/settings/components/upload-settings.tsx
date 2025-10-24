import { toast } from "sonner"
import { Button } from "@/renderer/components/ui/button"
import { useSettingsContext } from "@/renderer/app/providers/settings-provider"

export const UploadSettings = () => {
    const { persistSettings } = useSettingsContext()

    const handlePersistSettings = async () => {
        await persistSettings();

        toast("Configurações salvas com sucesso", {
            description: "Suas preferências foram atualizadas.",
            position: "top-right",
            duration: 3000,
            className:
                "mt-16 !bg-success !text-success-foreground !border !border-success/40 !px-4 !py-3 !font-medium",
        });
    };

    return (
        <div className="flex">
            <Button onClick={handlePersistSettings} className="w-full">
                <p>Salvar Configurações</p>
            </Button>
        </div>
    )
}