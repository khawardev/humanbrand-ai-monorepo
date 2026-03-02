import { aptivData } from './aptiv';
import { magnaData } from './magna';
import { boschMobilityData } from './bosch-mobility';
import { continentalData } from './continental';
import { densoData } from './denso';
import { forviaData } from './forvia';
import { gentexData } from './gentex';
import { learData } from './lear';
import { valeoData } from './valeo';
import { zfData } from './zf';

export const brandDataSources: any = {
    magna: magnaData,
    aptiv: aptivData,
    boschmobility: boschMobilityData,
    continental: continentalData,
    denso: densoData,
    forvia: forviaData,
    gentex: gentexData,
    lear: learData,
    valeo: valeoData,
    zf: zfData,
};

export const getBrandData = async (brand: string) => {
    const dataSource = brandDataSources[brand.toLowerCase()];
    if (!dataSource) {
        return null;
    }
    return dataSource;
};