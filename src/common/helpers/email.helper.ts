export function generateEmailHash(email: string): string {
    if (email == '' || email == undefined || email == null) return '';

    const splitted = email.split('@');
    const mailHost = splitted[1] ? '@' + splitted[1] : '';

    const hash = splitted[0].split('').map((c, i) => {
        return (i % (Math.floor(Math.random() * 2) + 2)) ? c : '*';
    }).join('');

    return hash + mailHost;
}