const mentionTemplate = (
    strings: TemplateStringsArray,
    ...values: string[]
): string => {
    let str = '';
    strings.forEach((string, i) => {
        str += `${string}${values[i] ? `<@!${values[i]}>` : ''}`;
    });

    return str;
};

export default mentionTemplate;
