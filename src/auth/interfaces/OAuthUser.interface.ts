export type OAuthUser = Partial<AllOAuthUser>;

type AllOAuthUser = {
  internal_id: string; // always send (basic)
  displayName: string; //displayName (teljes név)
  sn: string; //sn (családnév)
  givenName: string; //givenName (keresztnév)
  mail: string; //mail (email)
  linkedAccounts: {
    bme: string;
    schacc: string;
    vir: string;
    virUid: string;
  };
  lastSync: {
    bme: number;
    schacc: number;
    vir: number;
  }; // linkedAccounts (kapcsolt fiókok és utolsó frissítés) + vir=pék
  eduPersonEntitlement: [
    {
      id: number;
      name: string;
      title: [string];
      status: KorTagsag;
      start: string;
      end: string | null;
    },
  ]; // eduPersonEntitlement (körtagságok)
  mobile?: string; // mobile (telefonszám)
  // niifEduPersonAttendedCourse (félévben hallgatott tárgyak kódja ;-vel elválasztva)
  niifEduPersonAttendedCourse: string;
  entrants: [string]; // entrants (Közéleti belépők)
  admembership: [string]; // admembership (ActiveDirectory tagságok)
  bmeunitscope: [BMETipusok]; // bmeunitscope (BME jogviszonyok)
  permanentaddress: string; // permanentaddress (állandó lakcím)
};

type KorTagsag = 'körvezető' | 'tag' | 'öregtag';

export type BMETipusok =
  | 'BME'
  | 'BME_ACTIVE'
  | 'BME_VIK'
  | 'BME_VIK_ACTIVE'
  | 'BME_VIK_NEWBIE'
  | 'BME_VBK'
  | 'BME_VBK_ACTIVE'
  | 'BME_VBK_NEWBIE';
