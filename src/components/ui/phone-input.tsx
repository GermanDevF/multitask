import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_COUNTRY = "MX" as const;
const AVAILABLE_COUNTRIES: RPNInput.Country[] = ["MX", "US"];
const POPOVER_WIDTH = "w-[300px]" as const;
const SCROLL_AREA_VIEWPORT_SELECTOR =
  "[data-radix-scroll-area-viewport]" as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normaliza el valor del teléfono para evitar valores undefined.
 * react-phone-number-input puede retornar undefined cuando no se ingresa
 * un número válido. Esto lo convierte a una cadena vacía.
 */
const normalizePhoneValue = (
  value: RPNInput.Value | undefined
): RPNInput.Value => {
  return value || ("" as RPNInput.Value);
};

/**
 * Resetea el scroll del viewport del ScrollArea al inicio.
 */
const resetScrollTop = (
  scrollAreaRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!scrollAreaRef.current) return;

  const viewportElement = scrollAreaRef.current.querySelector<HTMLElement>(
    SCROLL_AREA_VIEWPORT_SELECTOR
  );

  if (viewportElement) {
    viewportElement.scrollTop = 0;
  }
};

// ============================================================================
// Components
// ============================================================================

/**
 * Componente principal de entrada de teléfono con selector de país.
 */
const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  const handleChange = React.useCallback(
    (value: RPNInput.Value | undefined) => {
      onChange?.(normalizePhoneValue(value));
    },
    [onChange]
  );

  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      defaultCountry={DEFAULT_COUNTRY}
      countries={AVAILABLE_COUNTRIES}
      onChange={handleChange}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

/**
 * Componente de entrada personalizado para el número de teléfono.
 */
const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn("rounded-s-none rounded-e-lg", className)}
    {...props}
  />
));

InputComponent.displayName = "InputComponent";

/**
 * Selector de país con búsqueda y lista de opciones.
 */
const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSearchValue("");
    }
  }, []);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value);
    // Resetear scroll al buscar para mostrar resultados desde el inicio
    setTimeout(() => resetScrollTop(scrollAreaRef), 0);
  }, []);

  const handleSelectComplete = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Popover open={isOpen} modal onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10"
          disabled={disabled}>
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn("-mr-2 size-4", disabled ? "hidden" : "opacity-50")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(POPOVER_WIDTH, "p-0")}>
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={handleSearchChange}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-auto">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(
                  ({ value, label }) =>
                    value && (
                      <CountrySelectOption
                        key={value}
                        country={value}
                        countryName={label}
                        selectedCountry={selectedCountry}
                        onChange={onChange}
                        onSelectComplete={handleSelectComplete}
                      />
                    )
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Opción individual en la lista de países.
 */
const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = React.useCallback(() => {
    onChange(country);
    onSelectComplete();
  }, [country, onChange, onSelectComplete]);

  const callingCode = React.useMemo(
    () => `+${RPNInput.getCountryCallingCode(country)}`,
    [country]
  );

  const isSelected = country === selectedCountry;

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-foreground/50 text-sm">{callingCode}</span>
      <CheckIcon
        className={cn(
          "ml-auto size-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

/**
 * Componente que renderiza la bandera del país.
 */
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  if (!Flag) return null;

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full">
      <Flag title={countryName} />
    </span>
  );
};

// ============================================================================
// Exports
// ============================================================================

export { PhoneInput };
export type { PhoneInputProps };
