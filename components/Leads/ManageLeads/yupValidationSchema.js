import { isEmpty } from 'lodash';
import * as yup from 'yup';

/** Adding just additional methods here */

yup.addMethod(yup.string, 'URL', function (...args) {
    return this.url(...args);
});

const validator = function (message) {
    return this.test('is-string-boolean', message, function (value) {
        if (isEmpty(value)) {
            return true;
        }

        if (['Y', 'N'].indexOf(value) !== -1) {
            return true;
        } else {
            return false;
        }
    });
};

yup.addMethod(yup.string, 'stringBoolean', validator);
yup.addMethod(yup.string, 'StringBoolean', validator);

export function createYupSchema(schema, config) {
    const { field, validationType, validations = [] } = config;
    if (!yup[validationType]) {
        return schema;
    }
    let validator = yup[validationType]();
    validations.forEach((validation) => {
        const { params, type } = validation;
        if (!validator[type]) {
            return;
        }
        validator = validator[type](...params);
    });
    if (field.indexOf('.') !== -1) {
        // nested fields are not covered in this example but are eash to handle tough
    } else {
        schema[field] = validator;
    }

    return schema;
}

export const getYupSchemaFromMetaData = (metadata, additionalValidations, forceRemove) => {
    const yepSchema = metadata.reduce(createYupSchema, {});
    const mergedSchema = {
        ...yepSchema,
        ...additionalValidations,
    };

    // forceRemove.forEach((field) => {
    //     delete mergedSchema[field];
    // });

    const validateSchema = yup.object().shape(mergedSchema);

    return validateSchema;
};
