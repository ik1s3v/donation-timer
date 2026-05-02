import { Box, Button, InputAdornment, TextField } from '@mui/material';
import type { SerializedError } from '@reduxjs/toolkit';
import { useWidgetMutation, useWidgetQuery } from '@widy/react';
import { AlertSeverity, type ISettings } from '@widy/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { useDispatch } from 'react-redux';
import { DEFAULT_TIMER } from '../constants';
import { showSnackBar } from '../store/slices/snackBarSlice';
import type { ITimer } from '../types';
import styles from './App.module.css';
import { AppSnackBar } from './components/AppSnackBar';
import ColorPicker from './components/ColorPicker';
import TimerView from './components/TimerView';

const App = () => {
  const dispatch = useDispatch();
  const { data: settings } = useWidgetQuery<unknown, ISettings>({
    scope: 'widgets:settings.read',
  });

  const { data } = useWidgetQuery<unknown, string>({
    scope: 'widgets:control:storage.read',
  });

  const { trigger } = useWidgetMutation<ITimer, unknown>({
    scope: 'widgets:control:storage.write',
  });

  const { t, i18n } = useTranslation();

  const [timer, setTimer] = useState<ITimer>(DEFAULT_TIMER);

  useEffect(() => {
    if (data) {
      setTimer(JSON.parse(data));
    }
  }, [data]);

  useEffect(() => {
    if (settings) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings, i18n]);

  return (
    <Box
      sx={{
        display: 'grid',
        padding: 2,
        placeItems: 'center',
        gap: 2,
      }}
    >
      <h1>{t('title')}</h1>
      <div className={styles.settingsContainer}>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('timer_color')}:</span>
          </div>
          <ColorPicker
            initialColor={timer.timer_color}
            onChange={(color) => {
              setTimer((prev) => ({ ...prev, timer_color: color }));
            }}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('text_color')}:</span>
          </div>
          <ColorPicker
            initialColor={timer.text_color}
            onChange={(color) => {
              setTimer((prev) => ({ ...prev, text_color: color }));
            }}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('timer_size')}:</span>
          </div>
          <NumericFormat
            style={{ width: 100 }}
            inputMode="decimal"
            autoComplete="off"
            allowNegative={false}
            valueIsNumericString
            decimalScale={0}
            min={1}
            isAllowed={({ floatValue }) =>
              floatValue === undefined || floatValue <= 100
            }
            customInput={TextField}
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
            onValueChange={(e) => {
              setTimer((prev) => ({ ...prev, timer_size: e.floatValue || 0 }));
            }}
            value={timer.timer_size}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('text_size')}:</span>
          </div>
          <NumericFormat
            style={{ width: 100 }}
            inputMode="decimal"
            autoComplete="off"
            allowNegative={false}
            valueIsNumericString
            decimalScale={0}
            min={1}
            isAllowed={({ floatValue }) =>
              floatValue === undefined || floatValue <= 100
            }
            customInput={TextField}
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
            onValueChange={(e) => {
              setTimer((prev) => ({ ...prev, text_size: e.floatValue || 0 }));
            }}
            value={timer.text_size}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('start_time')}:</span>
          </div>
          <NumericFormat
            style={{ width: 100 }}
            inputMode="decimal"
            autoComplete="off"
            allowNegative={false}
            valueIsNumericString
            decimalScale={0}
            min={0}
            customInput={TextField}
            onValueChange={(e) => {
              setTimer((prev) => ({ ...prev, start_time: e.floatValue || 0 }));
            }}
            value={timer.start_time}
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                },
                endAdornment: (
                  <InputAdornment position="end">{t('minutes')}</InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('1_min_coast')}:</span>
          </div>
          <NumericFormat
            style={{ width: 100 }}
            inputMode="decimal"
            autoComplete="off"
            allowNegative={false}
            valueIsNumericString
            decimalScale={0}
            min={0}
            customInput={TextField}
            onValueChange={(e) => {
              setTimer((prev) => ({ ...prev, time_coast: e.floatValue || 0 }));
            }}
            value={timer.time_coast}
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {settings?.currency}
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className={styles.settings}>
          <div className={styles.label}>
            <span>{t('text')}:</span>
          </div>
          <TextField
            variant="outlined"
            value={timer.text}
            style={{ width: '100%' }}
            multiline
            minRows={4}
            maxRows={4}
            onChange={(e) => {
              setTimer((prev) => ({ ...prev, text: e.target.value }));
            }}
          />
        </div>
      </div>
      <TimerView
        timer={timer}
        width={400}
        height={300}
        backgroundColor="green"
        isControl
      />
      <div style={{ display: 'flex', placeContent: 'center' }}>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await trigger(timer);
              setTimer(timer);
              dispatch(
                showSnackBar({
                  message: t('success'),
                  alertSeverity: AlertSeverity.success,
                }),
              );
            } catch (error) {
              const err = error as SerializedError;
              dispatch(
                showSnackBar({
                  message: err.message as string,
                  alertSeverity: AlertSeverity.error,
                }),
              );
            }
          }}
        >
          {t('start')}
        </Button>
      </div>
      <AppSnackBar />
    </Box>
  );
};

export default App;
