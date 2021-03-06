/*!
 * simpleextractor.js
 *
 * Copyright (c) Damien Churchill 2010 <damoxc@gmail.com>
 * Copyright (C) 2015 Chris Yereaztian <chris.yereaztian@gmail.com>
 *
 * This file is part of Deluge and is licensed under GNU General Public License 3.0, or later, with
 * the additional special exception to link portions of this program with the OpenSSL library.
 * See LICENSE for more details.
 *
 */

Ext.ns('Deluge.ux.preferences');

/**
 * @class Deluge.ux.preferences.SimpleExtractorPage
 * @extends Ext.Panel
 */
Deluge.ux.preferences.SimpleExtractorPage = Ext.extend(Ext.Panel, {

    title: _('SimpleExtractor'),
    layout: 'fit',
    border: false,

    initComponent: function() {
        Deluge.ux.preferences.SimpleExtractorPage.superclass.initComponent.call(this);

        this.form = this.add({
            xtype: 'form',
            layout: 'form',
            border: false,
            autoHeight: true
        });

        fieldset = this.form.add({
            xtype: 'fieldset',
            border: false,
            title: '',
            autoHeight: true,
            labelAlign: 'top',
            labelWidth: 80,
            defaultType: 'textfield'
        });

        this.extract_path = fieldset.add({
            fieldLabel: _('Extract to:'),
            labelSeparator : '',
            name: 'extract_path',
            width: '97%'
        });


        this.use_name_folder = fieldset.add({
            xtype: 'checkbox',
            name: 'use_name_folder',
            height: 22,
            hideLabel: true,
            boxLabel: _('Create torrent name sub-folder')
        });

        this.in_place_extraction = fieldset.add({
            xtype: 'checkbox',
            name: 'in_place_extraction',
            height: 22,
            hideLabel: true,
            boxLabel: _('Extract torrent in-place')
        });
        
        this.append_label_todir = fieldset.add({
            xtype: 'checkbox',
            name: 'append_label_todir',
            height: 22,
            hideLabel: true,
            boxLabel: _('Append label to destination')
        });        

        this.on('show', this.updateConfig, this);
    },

    onApply: function() {
        // build settings object
        var config = { }

        config['extract_path'] = this.extract_path.getValue();
        config['use_name_folder'] = this.use_name_folder.getValue();
        config['in_place_extraction'] = this.in_place_extraction.getValue();
        config['append_label_todir'] = this.append_label_todir.getValue();

        deluge.client.simpleextractor.set_config(config);
    },

    onOk: function() {
        this.onApply();
    },

    updateConfig: function() {
        deluge.client.simpleextractor.get_config({
            success: function(config) {
                this.extract_path.setValue(config['extract_path']);
                this.use_name_folder.setValue(config['use_name_folder']);
                this.in_place_extraction.setValue(config['in_place_extraction']);
                this.append_label_todir.setValue(config['append_label_todir']);
            },
            scope: this
        });
    }
});


Deluge.plugins.SimpleExtractorPlugin = Ext.extend(Deluge.Plugin, {

    name: 'SimpleExtractor',

    onDisable: function() {
        deluge.preferences.removePage(this.prefsPage);
    },

    onEnable: function() {
        this.prefsPage = deluge.preferences.addPage(new Deluge.ux.preferences.SimpleExtractorPage());
    }
});
Deluge.registerPlugin('SimpleExtractor', Deluge.plugins.SimpleExtractorPlugin);
